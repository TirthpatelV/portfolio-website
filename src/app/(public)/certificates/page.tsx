"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ExternalLink, Loader2, Award, Star } from "lucide-react";
import { Certificate } from "@/types";
import { supabase } from "@/lib/supabase";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  },
};

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .order("date_obtained", { ascending: false });
      setCertificates(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  // Centralized Water-Style Loader
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 selection:bg-emerald-100 dark:selection:bg-emerald-900/30 relative overflow-hidden"
    >
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32"
      >
        {/* Header Section */}
        <header className="mb-16 md:mb-24">
          <motion.div variants={itemVariants} className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <Star size={14} className="text-emerald-500 fill-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Verified.Log</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              My <br className="md:hidden" />
              <span className="text-zinc-300 dark:text-zinc-800 italic font-medium">Recognitions.</span>
            </h1>
            
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-base md:text-lg font-light">
              Formal validations and specialized training earned throughout my professional journey.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative h-full flex flex-col p-4 md:p-8 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl md:rounded-[2.5rem] hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5">
                  
                  <div className="flex justify-between items-start mb-4 md:mb-8">
                    <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all group-hover:rotate-12 group-hover:bg-emerald-600 group-hover:text-white">
                      <Award size={18} className="md:w-6 md:h-6" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-2 md:px-3 py-1 rounded-full uppercase tracking-widest">
                      {formatDate(cert.date_obtained)}
                    </span>
                  </div>

                  <div className="mb-6 md:mb-10 space-y-1 md:space-y-2">
                    <h3 className="text-base md:text-2xl font-black tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                      {cert.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-4 bg-emerald-500" />
                      <p className="text-emerald-600 dark:text-emerald-400 text-[9px] md:text-[11px] font-black uppercase tracking-widest">
                        {cert.issuer}
                      </p>
                    </div>
                    {cert.description && (
                      <p className="pt-1 md:pt-2 text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 md:pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group/link"
                    >
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover/link:text-zinc-900 dark:group-hover/link:text-white transition-colors">Verify Credential</span>
                      <ExternalLink size={16} className="md:w-[18px] md:h-[18px] text-zinc-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform group-hover/link:text-emerald-500" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {certificates.length === 0 && (
          <div className="py-20 text-center text-zinc-400 font-mono text-xs uppercase tracking-[0.3em]">
            Database Empty // No Records Found
          </div>
        )}
      </motion.main>
    </motion.div>
  );
}