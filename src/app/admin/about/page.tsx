"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Save, Upload, X, Plus, Trash2 } from "lucide-react";
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
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit About Section</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your professional profile and background</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8">

        {/* Profile Photo */}
        <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
          <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {profilePhotoPreview ? (
              <div className="relative w-full max-w-sm mx-auto">
                <img src={profilePhotoPreview} alt="Preview" className="w-full h-80 object-cover rounded-lg" />
                <button type="button" onClick={() => { setProfilePhoto(""); setProfilePhotoPreview(""); }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload size={32} className="text-blue-600 mb-2" />
                <span className="font-semibold">Click to upload profile photo</span>
                <span className="text-sm text-gray-500">PNG, JPG up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
              </label>
            )}
            {isUploading && <div className="flex items-center gap-2 text-blue-600"><Loader size={16} className="animate-spin" /><span>Uploading...</span></div>}
          </CardContent>
        </Card>

        {/* About Text */}
        <Card>
          <CardHeader><CardTitle>About You</CardTitle></CardHeader>
          <CardContent>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a short summary about yourself, your passion, and your journey..."
            />
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Education</CardTitle>
              <button type="button" onClick={() => setEducation([...education, emptyEdu()])}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                <Plus size={16} /> Add Entry
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Degree / Course</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => setEducation(education.map((item, idx) => idx === i ? { ...item, degree: e.target.value } : item))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">School / University</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={e => setEducation(education.map((item, idx) => idx === i ? { ...item, school: e.target.value } : item))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Gujarat University"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={e => setEducation(education.map((item, idx) => idx === i ? { ...item, year: e.target.value } : item))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2020 – 2024"
                  />
                </div>
                {education.length > 1 && (
                  <button type="button" onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <button type="button" onClick={() => setExperience([...experience, emptyExp()])}
                className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700">
                <Plus size={16} /> Add Entry
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Job Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={e => setExperience(experience.map((item, idx) => idx === i ? { ...item, title: e.target.value } : item))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => setExperience(experience.map((item, idx) => idx === i ? { ...item, company: e.target.value } : item))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. TechCorp India"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Year</label>
                  <input
                    type="text"
                    value={exp.year}
                    onChange={e => setExperience(experience.map((item, idx) => idx === i ? { ...item, year: e.target.value } : item))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. 2022 – Present"
                  />
                </div>
                {experience.length > 1 && (
                  <button type="button" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resume */}
        <Card>
          <CardHeader><CardTitle>Resume Link</CardTitle></CardHeader>
          <CardContent>
            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/resume.pdf"
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSaving} className="w-full h-12 text-base font-semibold">
          <Save size={18} className="mr-2" />
          {isSaving ? "Saving..." : "Save About Section"}
        </Button>
      </form>
    </motion.div>
  );
}

