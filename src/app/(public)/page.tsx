"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader, Sparkles, Download } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Profile, About } from "@/types";

// --- ADVANCED GLITCH & BLUR VARIANTS ---
const titleContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const glitchBlurVariant: Variants = {
  hidden: { opacity: 0, filter: "blur(15px)", y: 20, skewX: 10 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    skewX: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

const photoPortalReveal: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    filter: "brightness(0.5) contrast(120%)",
  },
  show: {
    scale: 1,
    opacity: 1,
    filter: "brightness(100%) contrast(100%)",
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
  },
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Track if the actual image file has finished downloading
  const [imageLoaded, setImageLoaded] = useState(false);

  const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind",
    "Node.js",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, aboutRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/about"),
        ]);
        const profileData = await profileRes.json();
        const aboutData = await aboutRes.json();
        setProfile(profileData);
        setAbout(aboutData);
        setIsLoaded(true);
      } catch (e) {
        console.error("Data fetch error:", e);
      }
    };
    fetchData();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex flex-col items-center justify-center">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden">
      {/* --- CLEAN GRID BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <AnimatePresence mode="wait">
        {isLoaded && (
          <motion.section
            initial="hidden"
            animate="show"
            className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-40 md:pt-48 lg:pt-56"
          >
            <div className="flex flex-col gap-14 lg:grid lg:grid-cols-12 lg:gap-20 items-center">
              {/* --- CONTENT COLUMN --- */}
              <div className="lg:col-span-7 space-y-10 text-center lg:text-left order-2 lg:order-1">
                <motion.div variants={titleContainer} className="space-y-6">
                  <motion.div
                    variants={glitchBlurVariant}
                    className="flex items-center justify-center lg:justify-start gap-4"
                  >
                    <div className="h-[1px] w-10 bg-blue-600/50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                      Full Stack Developer
                    </span>
                  </motion.div>

                  <h1 className="text-[12vw] lg:text-[115px] font-black tracking-[-0.07em] leading-[0.85] lg:leading-[0.75] uppercase flex flex-wrap justify-center lg:justify-start">
                    {"CREATIVE".split("").map((char, i) => (
                      <motion.span key={i} variants={glitchBlurVariant}>
                        {char}
                      </motion.span>
                    ))}
                    <br />
                    <span className="text-zinc-200 dark:text-zinc-800 italic font-medium flex">
                      {"ARCHITECT".split("").map((char, i) => (
                        <motion.span key={i} variants={glitchBlurVariant}>
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="max-w-xl mx-auto lg:mx-0 space-y-8"
                >
                  <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-light leading-snug tracking-tight">
                    I am{" "}
                    <span className="text-zinc-900 dark:text-white font-bold">
                      {profile.name}
                    </span>
                    .{" "}
                    <span className="italic underline decoration-blue-500/20 underline-offset-8">
                      {profile.bio}
                    </span>
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-3">
                    {technologies.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 + i * 0.05 }}
                        className="flex items-center gap-2 group cursor-default"
                      >
                        <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                          {tech}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* --- COMPACT BUTTONS --- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-4 relative z-20"
                >
                  {/* PROJECT BUTTON (SOLID) */}
                  <Link
                    href="/projects"
                    className="w-full sm:w-auto relative group"
                  >
                    <motion.button
                      whileHover={{ x: -2, y: -2 }}
                      whileTap={{ x: 2, y: 2 }}
                      className="relative w-full px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-2 border-zinc-900 dark:border-white font-black text-[10px] uppercase tracking-[0.2em] z-10"
                    >
                      <span className="flex items-center justify-center gap-2">
                        VIEW PROJECTS <ArrowRight size={14} />
                      </span>
                    </motion.button>

                    {/* THE GLITCH SHADOW */}
                    <motion.div
                      variants={{
                        hover: {
                          x: [4, 6, 2, 4], // Jitter movement
                          skewX: [0, -5, 5, 0], // Slight glitch skew
                          transition: { repeat: Infinity, duration: 0.2 },
                        },
                      }}
                      whileHover="hover"
                      className="absolute inset-0 border-2 border-zinc-900 dark:border-white translate-x-[4px] translate-y-[4px] z-0 pointer-events-none"
                    />
                  </Link>

                  {/* RESUME BUTTON (OUTLINE) */}
                  <Link
                    href="/about"
                    className="w-full sm:w-auto relative group"
                  >
                    <motion.button
                      whileHover={{ x: -2, y: -2 }}
                      whileTap={{ x: 2, y: 2 }}
                      className="relative w-full px-8 py-3.5 bg-transparent border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] z-10 transition-colors hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900"
                    >
                      <span className="flex items-center justify-center gap-2">
                        GET RESUME <Download size={14} />
                      </span>
                    </motion.button>

                    {/* THE REACTIVE SHADOW */}
                    <motion.div
                      variants={{
                        hover: {
                          x: 6,
                          y: 6,
                          backgroundColor: "rgba(24, 24, 27, 0.1)",
                          transition: { type: "spring", stiffness: 300 },
                        },
                      }}
                      whileHover="hover"
                      className="absolute inset-0 border-2 border-zinc-900 dark:border-white translate-x-[4px] translate-y-[4px] z-0 opacity-20 group-hover:opacity-100 pointer-events-none"
                    />
                  </Link>

                  {/* CONTACT BUTTON (OUTLINE) */}
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto relative group"
                  >
                    <motion.button
                      whileHover={{ x: -2, y: -2 }}
                      whileTap={{ x: 2, y: 2 }}
                      className="relative w-full px-8 py-3.5 bg-transparent border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] z-10 transition-colors hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900"
                    >
                      <span className="flex items-center justify-center gap-2">
                        GET IN TOUCH <ArrowRight size={14} />
                      </span>
                    </motion.button>

                    {/* THE REACTIVE SHADOW */}
                    <motion.div
                      variants={{
                        hover: {
                          x: 6,
                          y: 6,
                          backgroundColor: "rgba(24, 24, 27, 0.1)", // Slight tint on hover
                          transition: { type: "spring", stiffness: 300 },
                        },
                      }}
                      whileHover="hover"
                      className="absolute inset-0 border-2 border-zinc-900 dark:border-white translate-x-[4px] translate-y-[4px] z-0 opacity-20 group-hover:opacity-100 pointer-events-none"
                    />
                  </Link>
                </motion.div>
              </div>

              {/* --- IMAGE COLUMN WITH SMOOTH LOADING --- */}
              <motion.div
                variants={photoPortalReveal}
                className="w-full lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
              >
                <div className="relative group">
                  <div className="relative w-44 h-44 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full p-2 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm shadow-2xl overflow-hidden">
                    {/* Placeholder Loader: Shown only while image is downloading */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                        <Loader
                          className="animate-spin text-zinc-400"
                          size={24}
                        />
                      </div>
                    )}

                    <motion.div
                      className="relative h-full w-full rounded-full overflow-hidden"
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{
                        opacity: imageLoaded ? 1 : 0,
                        filter: imageLoaded ? "blur(0px)" : "blur(10px)",
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <Image
                        src={about?.profile_photo || "/profile.JPG"}
                        fill
                        alt={profile.name}
                        className="object-cover"
                        priority
                        onLoadingComplete={() => setImageLoaded(true)}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-2 -right-2 p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-2xl z-20"
                  >
                    <Sparkles size={18} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* --- CLEAN HUD --- */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="fixed bottom-4 md:bottom-6 left-0 right-0 z-0 pointer-events-none px-6 md:px-10"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0">
          <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] opacity-40">
            System.Active
          </span>
          <span className="text-[7px] md:text-[8px] font-mono tracking-[0.2em] uppercase opacity-30">
            © {new Date().getFullYear()} {profile?.name?.split(" ")[0]}
          </span>
        </div>
      </motion.div> */}
    </div>
  );
}
