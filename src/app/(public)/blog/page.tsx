"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Calendar, ArrowRight, Loader2, Star } from "lucide-react";
import { BlogPost } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/blog?published=true");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageLoad = (postId: string) => {
    setLoadingImages((prev) => {
      const updated = new Set(prev);
      updated.delete(postId);
      return updated;
    });
  };

  const handleImageStart = (postId: string) => {
    setLoadingImages((prev) => new Set(prev).add(postId));
  };

  const featuredPost = posts[0];
  const restPosts = posts.slice(1);

  // Centralized Water-Style Loader
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32"
      >
        {/* Balanced Header Styling */}
        <header className="mb-16 md:mb-24">
          <motion.div
            variants={itemVariants}
            className="space-y-4 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
              <Star size={14} className="text-amber-600 fill-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Journal.Log
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              Thoughts & <br className="md:hidden" />
              <span className="text-zinc-300 dark:text-zinc-800 italic font-medium">
                Reflections.
              </span>
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-base md:text-lg font-light">
              Personal insights, technical deep-dives, and creative
              explorations.
            </p>
          </motion.div>
        </header>

        <div className="space-y-20 md:space-y-32">
          {/* Featured Section */}
          {featuredPost && (
            <motion.div variants={itemVariants}>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative block"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] p-4 md:p-8 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 shadow-xl shadow-amber-500/5">
                  <div className="lg:col-span-7 aspect-[16/9] md:aspect-[21/9] lg:aspect-auto lg:h-[400px] overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-800 relative">
                    {loadingImages.has(`featured-${featuredPost.id}`) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 animate-pulse" />
                    )}
                    {featuredPost.image && (
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        onLoadStart={() =>
                          handleImageStart(`featured-${featuredPost.id}`)
                        }
                        onLoad={() =>
                          handleImageLoad(`featured-${featuredPost.id}`)
                        }
                        className={`w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 ${
                          loadingImages.has(`featured-${featuredPost.id}`)
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      />
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      <Calendar size={14} className="text-amber-500" />
                      {formatDate(
                        featuredPost.published_at || featuredPost.created_at,
                      )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white border-b-2 border-amber-500/20 pb-1 group-hover:border-amber-500 transition-all">
                      Read Featured Post <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid Section */}
          {restPosts.length > 0 && (
            <div className="space-y-12">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <h3 className="text-2xl font-bold tracking-tight">
                  Latest Entries
                </h3>
                <div className="h-px flex-grow bg-zinc-200 dark:bg-zinc-800" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {restPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex flex-col h-full"
                    >
                      <div className="aspect-[16/10] mb-6 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 relative">
                        {loadingImages.has(`post-${post.id}`) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 animate-pulse" />
                        )}
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            onLoadStart={() =>
                              handleImageStart(`post-${post.id}`)
                            }
                            onLoad={() => handleImageLoad(`post-${post.id}`)}
                            className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 ${
                              loadingImages.has(`post-${post.id}`)
                                ? "opacity-0"
                                : "opacity-80"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
                        <span className="text-amber-500">•</span>
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                      <h4 className="text-xl font-bold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-2 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        View Post{" "}
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.main>
    </motion.div>
  );
}
