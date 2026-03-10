"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader, Save, Upload, X, Plus, Trash2, UserCircle, BookOpen, Briefcase, Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface EducationEntry {
  degree: string;
  school: string;
  year: string;
}

interface ExperienceEntry {
  title: string;
  company: string;
  year: string;
}

const emptyEdu = (): EducationEntry => ({ degree: "", school: "", year: "" });
const emptyExp = (): ExperienceEntry => ({ title: "", company: "", year: "" });

export default function AdminAbout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [aboutText, setAboutText] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [education, setEducation] = useState<EducationEntry[]>([emptyEdu()]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([emptyExp()]);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/about");
      if (!response.ok) throw new Error("Failed to fetch about");
      const data = await response.json();

      setAboutText(data.about_text || "");
      setProfilePhoto(data.profile_photo || "");
      setProfilePhotoPreview(data.profile_photo || "");
      setResumeLink(data.resume_link || "");

      // Parse education — handle both array and plain string
      if (Array.isArray(data.education) && data.education.length > 0) {
        setEducation(data.education);
      } else if (typeof data.education === "string" && data.education.trim()) {
        try {
          const parsed = JSON.parse(data.education);
          setEducation(Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyEdu()]);
        } catch {
          setEducation([emptyEdu()]);
        }
      }

      // Parse experience — handle both array and plain string
      if (Array.isArray(data.experience) && data.experience.length > 0) {
        setExperience(data.experience);
      } else if (typeof data.experience === "string" && data.experience.trim()) {
        try {
          const parsed = JSON.parse(data.experience);
          setExperience(Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyExp()]);
        } catch {
          setExperience([emptyExp()]);
        }
      }
    } catch (error) {
      console.error("Error fetching about:", error);
      toast.error("Failed to load about section");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "profile-photos");
      const response = await fetch("/api/upload", { method: "POST", body: formDataUpload });
      const result = await response.json();
      if (!response.ok) throw new Error(result.details || result.error || "Upload failed");
      setProfilePhoto(result.url);
      setProfilePhotoPreview(result.url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          about_text: aboutText,
          profile_photo: profilePhoto,
          resume_link: resumeLink,
          education: education.filter(e => e.degree || e.school),
          experience: experience.filter(e => e.title || e.company),
        }),
      });
      if (!response.ok) throw new Error("Failed to save");
      toast.success("About section saved!");
    } catch {
      toast.error("Failed to save about section");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-40 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/30 transition";
  const labelClass = "block text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider";
  const sectionClass = "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-5 shadow-sm";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About Section</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your professional profile and background</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Profile Photo */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-4">
            <UserCircle size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold">Profile Photo</h2>
          </div>
          {profilePhotoPreview ? (
            <div className="relative w-32 h-32">
              <img src={profilePhotoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
              <button
                type="button"
                onClick={() => { setProfilePhoto(""); setProfilePhotoPreview(""); }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full max-w-sm p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload photo</span>
              <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
            </label>
          )}
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
              <Loader size={14} className="animate-spin" /><span>Uploading…</span>
            </div>
          )}
        </div>

        {/* About Text */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-4">
            <UserCircle size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold">About You</h2>
          </div>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={5}
            placeholder="Write a short summary about yourself, your passion, and your journey..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Education */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold">Education</h2>
            </div>
            <button
              type="button"
              onClick={() => setEducation([...education, emptyEdu()])}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Plus size={13} /> Add Entry
            </button>
          </div>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <label className={labelClass}>Degree / Course</label>
                  <input type="text" value={edu.degree} onChange={e => setEducation(education.map((item, idx) => idx === i ? { ...item, degree: e.target.value } : item))} className={inputClass} placeholder="e.g. B.Tech Computer Science" />
                </div>
                <div>
                  <label className={labelClass}>School / University</label>
                  <input type="text" value={edu.school} onChange={e => setEducation(education.map((item, idx) => idx === i ? { ...item, school: e.target.value } : item))} className={inputClass} placeholder="e.g. Gujarat University" />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <input type="text" value={edu.year} onChange={e => setEducation(education.map((item, idx) => idx === i ? { ...item, year: e.target.value } : item))} className={inputClass} placeholder="e.g. 2020 – 2024" />
                </div>
                {education.length > 1 && (
                  <button type="button" onClick={() => setEducation(education.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold">Work Experience</h2>
            </div>
            <button
              type="button"
              onClick={() => setExperience([...experience, emptyExp()])}
              className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              <Plus size={13} /> Add Entry
            </button>
          </div>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i} className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input type="text" value={exp.title} onChange={e => setExperience(experience.map((item, idx) => idx === i ? { ...item, title: e.target.value } : item))} className={inputClass} placeholder="e.g. Full Stack Developer" />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input type="text" value={exp.company} onChange={e => setExperience(experience.map((item, idx) => idx === i ? { ...item, company: e.target.value } : item))} className={inputClass} placeholder="e.g. TechCorp India" />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <input type="text" value={exp.year} onChange={e => setExperience(experience.map((item, idx) => idx === i ? { ...item, year: e.target.value } : item))} className={inputClass} placeholder="e.g. 2022 – Present" />
                </div>
                {experience.length > 1 && (
                  <button type="button" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2 mb-4">
            <Link2 size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold">Resume Link</h2>
          </div>
          <input
            type="url"
            value={resumeLink}
            onChange={(e) => setResumeLink(e.target.value)}
            placeholder="https://example.com/resume.pdf"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <Save size={15} />
          {isSaving ? "Saving…" : "Save About Section"}
        </button>
      </form>
    </motion.div>
  );
}

