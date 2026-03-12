// Profile/Home section types
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  hero_image?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  leetcode?: string;
  created_at: string;
  updated_at: string;
}

// About section types
export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  details?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  year: string;
  description?: string;
}

export interface About {
  id: string;
  about_text: string;
  profile_photo?: string;
  education: string | EducationItem[];
  experience: string | ExperienceItem[];
  resume_link?: string;
  created_at: string;
  updated_at: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "tools";
  icon?: string;
  level: "beginner" | "intermediate" | "advanced";
  created_at: string;
  updated_at: string;
}

// Certificate types
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date_obtained: string;
  date_from?: string;
  date_to?: string;
  certificate_url: string;
  description?: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Contact message types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  viewed_at?: string;
  created_at: string;
}

// User types (for admin)
export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}
