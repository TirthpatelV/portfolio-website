"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  ArrowLeft,
  Clock,
  Loader,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/types";

export default function BlogArticle() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const authorName = "Harmin Patel";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog?slug=${slug}&published=true`);
        if (!response.ok) throw new Error("Failed to fetch blog post");
        const data = await response.json();
        const foundPost = Array.isArray(data)
          ? data.find((p: BlogPost) => p.slug === slug)
          : null;
        if (!foundPost) throw new Error("Post not found");
        setPost(foundPost);
      } catch (err) {
        setError("Article not found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex flex-col items-center justify-center">
        <Loader className="animate-spin text-amber-500 mb-4" size={32} />
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
          Opening Journal
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter italic text-zinc-400">
            Lost a page?
          </h1>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-600 font-bold hover:underline"
          >
            <ArrowLeft size={18} /> Return to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      {/* Progress Bar (Subtle) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
      />

      {/* Floating Navigation */}
      <nav className="fixed top-8 left-8 z-40 hidden lg:block">
        <Link
          href="/blog"
          className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </Link>
      </nav>

      <main className="relative pb-24">
        {/* Hero Section */}
        <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-zinc-900">
          {!heroImageLoaded && post.image && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 animate-pulse" />
          )}
          {post.image && (
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: heroImageLoaded ? 0.6 : 0 }}
              transition={{ duration: 1.2 }}
              src={post.image}
              alt={post.title}
              onLoad={() => setHeroImageLoaded(true)}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] dark:from-[#050505] via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />{" "}
                  {formatDate(post.published_at || post.created_at)}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {estimateReadTime(post.content || "")}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-zinc-900 dark:text-white">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </header>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto px-6 mt-12 md:mt-20">
          {/* Summary/Excerpt Box */}
          {post.excerpt && (
            <div className="mb-12 p-6 md:p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/50 border-l-4 border-amber-500 italic text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              “{post.excerpt}”
            </div>
          )}
          {/* Content Area */}
          <article
            className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none 
            prose-headings:tracking-tighter prose-headings:font-bold
            prose-p:leading-relaxed prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:text-justify
            prose-strong:text-zinc-900 dark:prose-strong:text-white
            prose-img:rounded-3xl prose-img:shadow-2xl"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </article>
          {/* Footer Social / CTA */}
          {/* Define this at the top of your component or import from a config file */}

          <footer className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="group flex items-center gap-4 cursor-default">
                {/* Abstract Icon */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 dark:bg-black flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
                      backgroundSize: "6px 6px",
                    }}
                  />
                  <div className="relative w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-transform duration-500 group-hover:scale-150" />
                  <div className="absolute inset-0 border border-white/10 rounded-xl" />
                </div>

                <div>
                  {/* Dynamic Title from Blog Post */}
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {post.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                    Article by {authorName}
                  </p>
                </div>
              </div>

              <Link
                href="/blog"
                className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Back to Archive
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
