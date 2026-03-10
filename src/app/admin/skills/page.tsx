"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types";
import { Plus, Edit2, Trash2, X, Check, Code2, Server, Database, Wrench } from "lucide-react";
import toast from "react-hot-toast";

type Category = "frontend" | "backend" | "database" | "tools";
type Level = "beginner" | "intermediate" | "advanced";

const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  frontend: { label: "Frontend", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800", icon: Code2 },
  backend:  { label: "Backend",  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800", icon: Server },
  database: { label: "Database", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-200 dark:border-orange-800", icon: Database },
  tools:    { label: "Tools",    color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-200 dark:border-violet-800", icon: Wrench },
};

const LEVEL_CONFIG: Record<Level, { label: string; dots: number; color: string }> = {
  beginner:     { label: "Beginner",     dots: 1, color: "bg-yellow-400" },
  intermediate: { label: "Intermediate", dots: 2, color: "bg-blue-500" },
  advanced:     { label: "Advanced",     dots: 3, color: "bg-emerald-500" },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const LEVELS = Object.keys(LEVEL_CONFIG) as Level[];

function LevelDots({ level }: { level: Level }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.intermediate;
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`w-1.5 h-1.5 rounded-full ${n <= cfg.dots ? cfg.color : "bg-gray-200 dark:bg-gray-600"}`} />
      ))}
    </span>
  );
}

function SkillIcon({ name }: { name: string }) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "").replace("js", "javascript").replace("ts", "typescript");
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-shrink-0">
      <img
        src={`https://cdn.simpleicons.org/${slug}/gray`}
        alt={name}
        width={18}
        height={18}
        className="dark:invert"
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = "none";
          if (t.parentElement) {
            t.parentElement.innerHTML = `<span class="text-xs font-bold text-gray-400">${name.slice(0, 2).toUpperCase()}</span>`;
          }
        }}
      />
    </div>
  );
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "frontend" as Category, level: "intermediate" as Level });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from("skills").select("*").order("category").order("name");
      if (error) throw new Error(error.message);
      setSkills(data || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Skill name is required"); return; }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from("skills").update(formData).eq("id", editingId);
        if (error) throw error;
        toast.success("Skill updated!");
      } else {
        const { error } = await supabase.from("skills").insert([formData]);
        if (error) throw error;
        toast.success("Skill added!");
      }
      resetForm();
      await fetchSkills();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast.success("Skill deleted!");
      await fetchSkills();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete skill");
    }
  };

  const startEdit = (skill: Skill) => {
    setFormData({ name: skill.name, category: skill.category as Category, level: (skill.level || "intermediate") as Level });
    setEditingId(skill.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ name: "", category: "frontend", level: "intermediate" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSkills = activeTab === "all" ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} across {CATEGORIES.filter((c) => skills.some((s) => s.category === c)).length} categories
          </p>
        </div>
        <button
          onClick={() => { if (showForm && !editingId) { resetForm(); } else { setEditingId(null); setFormData({ name: "", category: "frontend", level: "intermediate" }); setShowForm(true); } }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const Icon = cfg.icon;
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(activeTab === cat ? "all" : cat)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${activeTab === cat ? `${cfg.bg} ${cfg.border}` : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
            >
              <div className={`p-2 rounded-lg ${cfg.bg} ${cfg.border} border`}>
                <Icon size={16} className={cfg.color} />
              </div>
              <div>
                <p className={`text-lg font-bold ${activeTab === cat ? cfg.color : ""}`}>{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base">{editingId ? "Edit Skill" : "New Skill"}</h2>
              <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
              {/* Name */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  required
                  placeholder="e.g. React, Python…"
                  className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/30 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/30 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Proficiency</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as Level })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/30 transition"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{LEVEL_CONFIG[l].label}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="sm:col-span-3 flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <Check size={14} />
                  {saving ? "Saving…" : editingId ? "Update Skill" : "Add Skill"}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", ...CATEGORIES] as const).map((tab) => {
          const isAll = tab === "all";
          const cfg = !isAll ? CATEGORY_CONFIG[tab] : null;
          const count = isAll ? skills.length : skills.filter((s) => s.category === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeTab === tab
                  ? isAll
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
                    : `${cfg!.bg} ${cfg!.color} ${cfg!.border}`
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {isAll ? "All" : cfg!.label}
              <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-sm">No skills yet. Click <strong>Add Skill</strong> to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map((skill) => {
            const cat = CATEGORY_CONFIG[skill.category as Category] || CATEGORY_CONFIG.tools;
            const level = LEVEL_CONFIG[(skill.level || "intermediate") as Level] || LEVEL_CONFIG.intermediate;
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
              >
                <SkillIcon name={skill.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{skill.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${cat.bg} ${cat.color}`}>
                      {cat.label}
                    </span>
                    <LevelDots level={(skill.level || "intermediate") as Level} />
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{level.label}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(skill)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
