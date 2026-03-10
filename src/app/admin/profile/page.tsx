"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Profile } from "@/types";
import { Save, User, Link2, Info } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        title: data.title || "",
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save profile");
      await response.json();
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/30 transition";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your homepage profile information</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
        <Info size={15} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Profile photo</strong> is managed in the <strong>About</strong> section — it appears on both the homepage and about page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Basic Info */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold">Basic Information</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Title / Role</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Full Stack Developer" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Bio / Description</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell visitors about yourself" className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Link2 size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold">Social Links</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>GitHub</label>
              <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourname" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Twitter / X</label>
              <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://twitter.com/yourname" className={inputClass} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <Save size={15} />
          {isSaving ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </motion.div>
  );
}
