"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ChevronLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNotification } from "@/lib/useNotification";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const notification = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        notification.error(data.message || "Failed to send reset email");
        return;
      }

      setIsSubmitted(true);
      notification.success("Reset link sent! Check your email");
    } catch (error) {
      notification.error("Error sending reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#090a0c] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-indigo-500/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-blue-500/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Top Navigation */}
        <Link
          href="/admin/login"
          className="group mb-4 sm:mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors ml-2"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl shadow-indigo-500/10">
          {!isSubmitted ? (
            <>
              <div className="mb-8 sm:mb-10 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 sm:mb-6 shadow-lg shadow-indigo-600/20">
                  <Mail className="text-white" size={22} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Enter your admin email to receive a password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
                    placeholder="admin@example.com"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  type="submit"
                  className="relative w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <Mail size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-6">
                  <CheckCircle className="text-emerald-500" size={32} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Email Sent!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Check{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {email}
                  </span>{" "}
                  for a password reset link.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                  The link will expire in 1 hour.
                </p>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
