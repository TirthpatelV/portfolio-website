"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { About } from "@/types";
import {
  Loader2,
  Download,
  Briefcase,
  BookOpen,
  ArrowRight,
  Star,
  FileText,
  Crown,
} from "lucide-react";

// --- ANIMATED INDIVIDUAL CARD COMPONENT ---
function TimelineCard({
  item,
  direction,
  color,
}: {
  item: any;
  direction: "left" | "right";
  color: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 90%", "start 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.92, 1]);
  const x = useTransform(
    smoothProgress,
    [0, 1],
    [direction === "left" ? -60 : 60, 0]
  );
  
  /**
   * FIX: REDUCED BLUR
   * Changed from 12px to 2px. 
   * This provides a subtle "focus" effect without the heavy blur that looks like lag on mobile.
   */
  const blurValue = useTransform(smoothProgress, [0, 0.8], [2, 0]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);
  
  const iconColor = useTransform(
    smoothProgress,
    [0, 1],
    ["#a1a1aa", color === "blue" ? "#3b82f6" : "#a855f7"]
  );
  
  const borderColor = useTransform(
    smoothProgress,
    [0, 1],
    ["#e4e4e7", color === "blue" ? "#3b82f6" : "#a855f7"]
  );

  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0.1]);

  return (
    <div ref={cardRef} className="relative mb-8 md:mb-12 last:mb-0">
      <div className="absolute left-0 top-5 md:top-7 -translate-x-1/2 z-20">
        <motion.div
          style={{ opacity: glowOpacity, scale: 2 }}
          className={`absolute inset-0 rounded-full ${
            color === "blue" ? "bg-blue-500" : "bg-purple-500"
          } blur-2xl`}
        />
        <motion.div
          style={{
            scale: smoothProgress,
            borderColor: borderColor,
            color: iconColor,
            borderWidth: "2px",
          }}
          className="relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-white dark:bg-[#050505] border flex items-center justify-center shadow-md"
        >
          <Crown size={10} />
        </motion.div>
      </div>

      <motion.div
        style={{ opacity, x, scale, filter }}
        className="ml-6 md:ml-10 text-left p-4 md:p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 shadow-sm backdrop-blur-sm"
      >
        <div className="space-y-1">
          <motion.span
            style={{ color: iconColor }}
            className="text-[9px] font-bold uppercase tracking-widest"
          >
            {item.year}
          </motion.span>
          <h4 className="text-base md:text-xl font-semibold md:font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {item.degree || item.title}
          </h4>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">
            {item.school || item.company}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- INDEPENDENT COLUMN COMPONENT ---
function TimelineColumn({
  title,
  icon,
  items,
  color,
  direction,
}: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  color: string;
  direction: "left" | "right";
}) {
  const columnRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: columnRef,
    offset: ["start 80%", "end 80%"],
  });

  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
  });

  return (
    <div ref={columnRef} className="space-y-6 md:space-y-12">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          color === "blue" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
        }`}>
          {icon}
        </div>
        <h3 className="text-xl md:text-3xl font-bold tracking-tight uppercase text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      </div>

      <div className="relative ml-4 md:ml-6">
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <motion.div
          style={{ scaleY: lineHeight }}
          className={`absolute left-0 top-0 bottom-0 w-[1px] ${
            color === "blue" ? "bg-blue-500" : "bg-purple-500"
          } origin-top z-10`}
        />
        <div className="space-y-0 pt-2">
          {items?.map((item, i) => (
            <TimelineCard key={i} item={item} direction={direction} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function About() {
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // FIX: IMAGE LOADER STATE
  const [imgIsLoading, setImgIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        setAbout(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#fafafa] dark:bg-[#050505] transition-colors duration-500 relative overflow-x-hidden"
    >
      <motion.div
        className="fixed top-[72px] left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 z-[200] origin-left shadow-[0_1px_10px_rgba(37,99,235,0.2)]"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-24 md:pt-48 pb-10 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-4">
          <Star size={12} className="text-blue-600" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Profile</span>
        </div>
        <h1 className="text-4xl md:text-9xl font-bold md:font-black tracking-tight md:tracking-tighter leading-tight md:leading-[0.85] uppercase text-zinc-900 dark:text-zinc-100">
          Who <br className="md:hidden" />{" "}
          <span className="text-zinc-400 dark:text-zinc-700 italic font-medium">I Am.</span>
        </h1>
      </header>

      <motion.main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16 md:mb-32">
          
          {/* Profile Section with FIX: Smooth Loader */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2 flex flex-col items-center">
            <div className="relative max-w-[280px] md:max-w-none w-full">
              <div className="aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-sm">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  
                  {/* SKELETON / LOADER */}
                  {imgIsLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-900 animate-pulse">
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                    </div>
                  )}

                  {about?.profile_photo && (
                    <motion.img
                      src={about.profile_photo}
                      alt="Profile"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imgIsLoading ? 0 : 1 }}
                      transition={{ duration: 0.5 }}
                      onLoad={() => setImgIsLoading(false)}
                      className="w-full h-full object-cover md:grayscale md:hover:grayscale-0 md:hover:scale-110 transition-all duration-700"
                    />
                  )}
                </div>
              </div>
            </div>

            {about?.resume_link && (
              <motion.a
                href={about.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.96 }}
                className="group relative flex items-center justify-between w-full max-w-[280px] p-4 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border-2 border-white/20 dark:border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-blue-500/50 shadow-xl"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Professional CV</h4>
                    <span className="text-[8px] font-mono text-blue-500 font-bold uppercase">LATEST</span>
                  </div>
                </div>
                <Download size={18} className="relative z-10 text-zinc-400 group-hover:text-blue-500 transition-colors" />
              </motion.a>
            )}
          </div>

          <div className="lg:col-span-7 space-y-6 md:space-y-10 order-2 lg:order-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-zinc-900 dark:text-zinc-100">About Me</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-2xl leading-relaxed text-justify">
              {about?.about_text}
            </p>
            <Link href="/contact">
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group cursor-pointer">
                <span className="text-xs md:text-sm uppercase tracking-widest border-b border-current pb-0.5">Let's Connect</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative mb-12 md:mb-20">
          <TimelineColumn
            title="Education"
            icon={<BookOpen size={isMobile ? 18 : 24} />}
            items={Array.isArray(about?.education) ? about.education : []}
            color="blue"
            direction="left"
          />
          <TimelineColumn
            title="Experience"
            icon={<Briefcase size={isMobile ? 18 : 24} />}
            items={Array.isArray(about?.experience) ? about.experience : []}
            color="purple"
            direction="right"
          />
        </div>
      </motion.main>
    </motion.div>
  );
}