"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  ChevronLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotification } from "@/lib/useNotification";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const notification = useNotification();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if Supabase token exists in URL hash
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Supabase will automatically handle the token from the URL hash
        const { data, error } = await supabase.auth.getSession();

        // If session exists, the token hash was valid
        if (data?.session) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error("Token check error:", error);
        setIsValidToken(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Add small delay to ensure hash is processed
    const timer = setTimeout(checkToken, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      notification.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      notification.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Update password using Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        notification.error(error.message || "Failed to update password");
        return;
      }

      setIsSuccess(true);
      notification.success("Password updated successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      notification.error("Error updating password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0f1115]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full"
        />
        <span className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Loading
        </span>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#090a0c] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30">
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
          <div className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl shadow-indigo-500/10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/20 mb-6">
              <Lock className="text-red-500" size={32} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              href="/admin/recovery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Request New Reset Link
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
          {!isSuccess ? (
            <>
              <div className="mb-8 sm:mb-10 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 sm:mb-6 shadow-lg shadow-indigo-600/20">
                  <Lock className="text-white" size={22} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Create New Password
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Enter your new admin password below.
                </p>
              </div>

              <form
                onSubmit={handleResetPassword}
                className="space-y-4 sm:space-y-6"
              >
                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
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
                      <span>Update Password</span>
                      <Lock size={18} />
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
                  Password Updated!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Your password has been successfully updated. Redirecting to
                  login...
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
