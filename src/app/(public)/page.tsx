"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader, Sparkles, Globe, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Profile, About } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 },
  },
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, 40]);
  const y2 = useTransform(scrollY, [0, 500], [0, -40]);

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
      {/* --- REFINED MINIMALIST BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Very faint grid - only 2% opacity for a premium feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Soft Ambient Orbs */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/[0.06] blur-[100px] rounded-full"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-[0%] left-[-5%] w-[500px] h-[500px] bg-purple-500/[0.04] blur-[120px] rounded-full"
        />
      </div>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 md:pt-48 lg:pt-56"
      >
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-12 lg:gap-20 items-center">
          {/* --- CONTENT COLUMN --- */}
          <div className="lg:col-span-7 space-y-10 text-center lg:text-left order-2 lg:order-1">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="h-[1px] w-10 bg-blue-600/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">
                  Full Stack Developer
                </span>
              </div>

              <h1 className="text-[12vw] lg:text-[115px] font-black tracking-[-0.07em] leading-[0.85] lg:leading-[0.75] uppercase transition-all">
                Creative <br />
                <span className="text-zinc-200 dark:text-zinc-800 italic font-medium">
                  Architect
                </span>
              </h1>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="max-w-xl mx-auto lg:mx-0 space-y-8"
            >
              <p className="text-xl md:text-3xl text-zinc-500 dark:text-zinc-400 font-light leading-snug tracking-tight">
                I am{" "}
                <span className="text-zinc-900 dark:text-white font-bold">
                  {profile.name}
                </span>
                . Crafting high-end web systems with{" "}
                <span className="italic underline decoration-blue-500/20 underline-offset-8">
                  absolute precision
                </span>
                .
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3">
                {technologies.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 group cursor-default"
                  >
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4"
            >
              <Link href="/projects" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-none px-12 h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black tracking-[0.2em] text-[10px] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-500">
                  VIEW PROJECTS
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-none px-12 h-16 border-zinc-200 dark:border-zinc-800 font-black tracking-[0.2em] text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                >
                  GET IN TOUCH
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* --- IMAGE COLUMN: COMPACT & ELEGANT --- */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[260px] md:max-w-[320px] aspect-[4/5] group">
              {/* Refined Decorative Frame */}
              <div className="absolute -inset-8 border border-zinc-100 dark:border-zinc-900 rounded-full opacity-40 -z-10 group-hover:scale-110 transition-transform duration-1000" />

              {/* Art Frame */}
              <div className="relative h-full w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-3 md:p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                <div className="relative h-full w-full rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden">
                  <Image
                    src={about?.profile_photo || "/profile.JPG"}
                    fill
                    alt={profile.name}
                    priority={!about?.profile_photo}
                    sizes="(max-width: 768px) 260px, (max-width: 1024px) 320px, 320px"
                    className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Minimalist Floating Accent */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 p-4 md:p-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-2xl z-20">
                <Sparkles size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- HUD STATUS DOCK --- */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 left-6 right-6 z-50 pointer-events-none md:bottom-10"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 px-8 py-4 rounded-full shadow-xl pointer-events-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
                Operational
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Globe size={11} className="opacity-30" />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">
                V.2.0.26
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-[1px] w-6 bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-[9px] font-mono opacity-30 uppercase tracking-[0.3em]">
              Vadodara, Gujarat
            </span>
          </div>
        </div>
      </motion.div>

      <div className="h-20" />
    </div>
  );
}
