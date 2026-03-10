"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Github,
  ArrowUpRight,
  Loader,
  Search,
  Command,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Project } from "@/types";
import { supabase } from "@/lib/supabase";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 15 },
  },
};

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {/* Skeleton shown while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          <Command size={28} className="text-zinc-300 dark:text-zinc-600" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-105 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      setProjects(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tech_stack?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  }, [search, projects]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 selection:bg-purple-100 dark:selection:bg-purple-900/30">
      {/* Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 hidden md:block blur-[80px] rounded-full" />
        <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 dark:bg-blue-500/10 hidden md:block blur-[80px] rounded-full" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-5xl mx-auto px-5 pt-28 pb-12 md:pt-48 md:pb-24"
      >
        {/* Header Section */}
        <header className="relative mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
                <Sparkles size={16} />
                <span className="text-[10px] uppercase tracking-[0.4em]">
                  Selected Works
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
                Product <br />
                <span className="text-zinc-300 dark:text-zinc-800 italic font-medium">
                  Archive.
                </span>
              </h1>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="relative group w-full md:w-80"
            >
              <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 shadow-sm group-focus-within:border-purple-500/50 transition-all">
                <Search className="text-zinc-400 mr-3" size={18} />
                <input
                  type="text"
                  placeholder="Filter by tech or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full outline-none text-sm placeholder:text-zinc-500 font-bold uppercase tracking-widest"
                />
                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[10px] text-zinc-400 font-mono font-bold">
                  <Command size={10} /> K
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader className="animate-spin text-purple-500" size={32} />
            <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-[0.3em]">
              Indexing Projects
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="group"
                >
                  <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] hover:bg-white dark:hover:bg-zinc-900/80 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/5">
                    {/* Project Image */}
                    <div className="relative w-full md:w-64 aspect-video md:aspect-square rounded-[1.8rem] overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
                      {project.image ? (
                        <ProjectImage src={project.image} alt={project.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-zinc-400 dark:text-zinc-600 text-xs uppercase tracking-widest font-bold">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Detail */}
                    <div className="flex-grow space-y-5 w-full">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">
                            {project.title}
                          </h2>
                          <div className="h-0.5 w-8 bg-purple-500 rounded-full" />
                        </div>

                        <div className="flex gap-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-xl shadow-purple-500/20"
                            >
                              <ArrowUpRight size={20} />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-light line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.tech_stack?.map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
