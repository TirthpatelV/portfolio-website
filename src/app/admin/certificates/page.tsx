"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Award,
  ExternalLink,
  Calendar,
  Building2,
  Star,
} from "lucide-react";
import { useNotification } from "@/lib/useNotification";
import { useDeleteModal } from "@/lib/deleteModal";
import { Certificate } from "@/types";
import { supabase } from "@/lib/supabase";

export default function AdminCertificates() {
  const notification = useNotification();
  const deleteModal = useDeleteModal();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date_obtained: "",
    certificate_url: "",
    description: "",
    is_featured: false,
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("date_obtained", { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      notification.error(error?.message || "Failed to fetch certificates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.issuer.trim() ||
      !formData.date_obtained ||
      !formData.certificate_url.trim()
    ) {
      notification.error("Required fields are missing");
      return;
    }

    try {
      new URL(formData.certificate_url);
    } catch {
      notification.error("Please enter a valid URL");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("certificates")
          .update({
            title: formData.title,
            issuer: formData.issuer,
            date_obtained: formData.date_obtained,
            certificate_url: formData.certificate_url,
            description: formData.description,
            is_featured: formData.is_featured,
          })
          .eq("id", editingId);
        if (error) throw error;
        notification.success("Certificate updated!");
      } else {
        const { error } = await supabase.from("certificates").insert([
          {
            title: formData.title,
            issuer: formData.issuer,
            date_obtained: formData.date_obtained,
            certificate_url: formData.certificate_url,
            description: formData.description,
            is_featured: formData.is_featured,
          },
        ]);
        if (error) throw error;
        notification.success("Certificate added!");
      }

      resetForm();
      await fetchCertificates();
    } catch (error: any) {
      notification.error(error?.message || "Failed to save certificate");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !(await deleteModal.confirm(
        "Are you sure you want to permanently delete this certificate?",
      ))
    )
      return;
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);
      if (error) throw error;
      notification.success("Certificate deleted!");
      await fetchCertificates();
    } catch (error: any) {
      notification.error(error?.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      date_obtained: "",
      certificate_url: "",
      description: "",
      is_featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      {/* Header - Fixed Responsiveness */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Certificates
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {certificates.length} credentials earned.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Form Card */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#16191f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-200">
                {editingId ? "Modify Credential" : "New Credential"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Certificate Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus
                    required
                    placeholder="e.g. AWS Solutions Architect"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Issuing Organization *</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) =>
                      setFormData({ ...formData, issuer: e.target.value })
                    }
                    required
                    placeholder="e.g. Amazon Web Services"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Date Obtained *</label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      value={formData.date_obtained}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_obtained: e.target.value,
                        })
                      }
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Certificate URL *</label>
                  <input
                    type="url"
                    value={formData.certificate_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate_url: e.target.value,
                      })
                    }
                    required
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Course Start Date (Optional)</label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      value={formData.date_from}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_from: e.target.value,
                        })
                      }
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Course End Date (Optional)</label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      value={formData.date_to}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_to: e.target.value,
                        })
                      }
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Brief Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Optional details..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_featured: !formData.is_featured,
                    })
                  }
                  className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all ${
                    formData.is_featured
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30"
                  }`}
                >
                  {formData.is_featured && (
                    <Star size={16} fill="currentColor" />
                  )}
                </button>
                <div>
                  <label className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                    Highlight Certificate
                  </label>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Featured certificates appear first and stand out to visitors
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  <Check size={18} />
                  <span>
                    {editingId ? "Update Certificate" : "Add Certificate"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16191f] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5">
          <Award size={40} className="mx-auto mb-4 text-slate-300 opacity-50" />
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            No certifications found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              layout
              className={`group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl transition-all hover:shadow-sm ${
                cert.is_featured
                  ? "bg-gradient-to-r from-yellow-50 via-yellow-50/50 to-transparent dark:from-yellow-500/10 dark:via-transparent dark:to-transparent border border-yellow-200 dark:border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                  : "bg-white dark:bg-[#16191f] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 border ${
                  cert.is_featured
                    ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/40"
                    : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20"
                }`}
              >
                {cert.is_featured ? (
                  <Star size={22} fill="currentColor" />
                ) : (
                  <Award size={22} />
                )}
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {cert.title}
                    </h3>
                    {cert.is_featured && (
                      <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Building2 size={12} /> {cert.issuer}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {formatDate(cert.date_obtained)}
                  </span>
                  {cert.description && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700 font-bold text-xs">
                        ·
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                        {cert.description}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons - Optimized for Mobile Visibility */}
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-white/5">
                <a
                  href={cert.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                >
                  <ExternalLink size={18} className="sm:size-4" />
                </a>
                <div className="h-6 w-[1px] bg-slate-100 dark:bg-white/10 mx-1 hidden sm:block" />

                {/* Always visible on mobile, hover effect on lg screens */}
                <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from("certificates")
                          .update({ is_featured: !cert.is_featured })
                          .eq("id", cert.id);
                        if (error) throw error;
                        notification.success(
                          cert.is_featured
                            ? "Certificate removed from highlights"
                            : "Certificate highlighted!",
                        );
                        await fetchCertificates();
                      } catch (error: any) {
                        notification.error("Failed to update certificate");
                      }
                    }}
                    className={`p-2.5 rounded-xl transition-colors ${
                      cert.is_featured
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-slate-400 hover:text-yellow-500"
                    }`}
                    title={
                      cert.is_featured
                        ? "Remove highlight"
                        : "Highlight certificate"
                    }
                  >
                    <Star
                      size={18}
                      className="sm:size-4"
                      fill={cert.is_featured ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        title: cert.title,
                        issuer: cert.issuer,
                        date_obtained: cert.date_obtained,
                        certificate_url: cert.certificate_url,
                        description: cert.description || "",
                        is_featured: cert.is_featured || false,
                      });
                      setEditingId(cert.id);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Edit2 size={18} className="sm:size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} className="sm:size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
