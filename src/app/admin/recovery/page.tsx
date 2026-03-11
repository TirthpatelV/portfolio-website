"use client";

import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminRecoveryPage() {
  const steps = [
    {
      number: 1,
      title: "Visit Supabase Dashboard",
      description: "Go to supabase.com and log in",
    },
    {
      number: 2,
      title: "Go to Authentication → Users",
      description: "Click Users in the left sidebar",
    },
    {
      number: 3,
      title: "Find Your Email",
      description: "Search for your admin email",
    },
    {
      number: 4,
      title: "Click Reset Password",
      description: "Click the three dots (⋯) and select Reset",
    },
    {
      number: 5,
      title: "Check Your Email",
      description: "A reset link will be sent to your inbox",
    },
    {
      number: 6,
      title: "Set New Password",
      description: "Click the link and create a new password",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#090a0c] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-blue-500/10 blur-[80px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Back Button */}
        <Link
          href="/admin/login"
          className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-500/5 dark:to-blue-500/5 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500">
                <Lock className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Password Recovery
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  6 simple steps to reset your password
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 sm:p-8">
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
                >
                  {/* Step Number */}
                  <div className="flex items-start justify-center w-10 h-10 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm shrink-0 mt-0.5">
                    {step.number}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="px-6 sm:px-8 py-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              ⚡ Quick Tips
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span>📧</span>
                <span>Check spam folder for reset email</span>
              </li>
              <li className="flex gap-2">
                <span>⏱️</span>
                <span>Reset link expires in 1 hour</span>
              </li>
              <li className="flex gap-2">
                <span>🔒</span>
                <span>Make your new password strong (8+ chars)</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 py-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/login"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Login
            </Link>
            <Link
              href="/admin/forgot-password-pin"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold text-sm rounded-lg transition-colors"
            >
              🔐 Use PIN Instead
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
