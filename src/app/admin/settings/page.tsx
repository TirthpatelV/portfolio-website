"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotification } from "@/lib/useNotification";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // PIN States
  const [securityPin, setSecurityPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isPinSuccess, setIsPinSuccess] = useState(false);

  const notification = useNotification();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword) {
      notification.error("Current password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      notification.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      notification.error("Password must be at least 6 characters");
      return;
    }

    if (currentPassword === newPassword) {
      notification.error(
        "New password must be different from current password",
      );
      return;
    }

    setIsLoading(true);

    try {
      // First verify current password by attempting login
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (authError) {
        notification.error("Current password is incorrect");
        setIsLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        notification.error(updateError.message || "Failed to update password");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      notification.success("Password changed successfully!");

      // Reset form
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      notification.error("Error changing password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Security PIN Update
  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!securityPin || securityPin.length !== 4) {
      notification.error("PIN must be exactly 4 digits");
      return;
    }

    if (securityPin !== confirmPin) {
      notification.error("PINs do not match");
      return;
    }

    setIsPinLoading(true);

    try {
      const user = await supabase.auth.getUser();
      const userEmail = user.data.user?.email;

      if (!userEmail) {
        notification.error("Could not get user email");
        return;
      }

      // Get the session token for authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        notification.error("Authentication token not found");
        setIsPinLoading(false);
        return;
      }

      // Save PIN to database via API
      const response = await fetch("/api/admin/set-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, pin: securityPin }),
      });

      const data = await response.json();

      if (!response.ok) {
        notification.error(data.message || "Failed to set PIN");
        return;
      }

      setIsPinSuccess(true);
      notification.success("Security PIN updated successfully!");

      setTimeout(() => {
        setSecurityPin("");
        setConfirmPin("");
        setIsPinSuccess(false);
      }, 2000);
    } catch (error) {
      notification.error("Error setting PIN");
      console.error(error);
    } finally {
      setIsPinLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400";
  const labelClass =
    "block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const sectionClass =
    "rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#16191f] overflow-hidden shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-10 pb-20"
    >
      {/* Header */}
      <div className="space-y-2 px-1">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">
          Settings
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Manage your admin account security.
        </p>
      </div>

      {/* Important Notice */}
      <div className="rounded-[2rem] border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 p-6 space-y-3">
        <div className="flex gap-3">
          <div className="text-2xl">🔐</div>
          <div className="space-y-2">
            <p className="font-bold text-indigo-900 dark:text-indigo-200">
              Backup Access Method
            </p>
            <p className="text-sm text-indigo-800 dark:text-indigo-300">
              This authenticated password change form is your{" "}
              <strong>secure backup</strong> if you can't access Supabase. As
              long as you can login, you can change your password here.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className={sectionClass}>
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
          <Lock size={18} className="text-indigo-500" />
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Change Password
          </h2>
        </div>

        <div className="p-8">
          {!isSuccess ? (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Update your admin password. You'll be asked to confirm your
                current password for security.
              </p>

              {/* Current Password */}
              <div className="space-y-1">
                <label className={labelClass}>Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password Requirements */}
                <div className="text-xs space-y-2 mt-3 pl-3">
                  <div
                    className={`flex items-center gap-2 ${newPassword.length >= 6 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    <span className={newPassword.length >= 6 ? "✓" : "○"}>
                      At least 6 characters
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${newPassword !== currentPassword && newPassword.length > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    <span
                      className={
                        newPassword !== currentPassword &&
                        newPassword.length > 0
                          ? "✓"
                          : "○"
                      }
                    >
                      Different from current password
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className={labelClass}>Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-8"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Update Password</span>
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-6">
                <CheckCircle className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Password Updated!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your password has been changed successfully.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security PIN Card */}
      <div className={sectionClass}>
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2">
          <KeyRound size={18} className="text-indigo-500" />
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Security PIN (For Password Recovery)
          </h2>
        </div>

        <div className="p-8">
          {!isPinSuccess ? (
            <form onSubmit={handleSetPin} className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Set a 4-digit PIN code. This is used to verify your identity
                when resetting your password without logging in.
              </p>

              {/* PIN Field */}
              <div className="space-y-1">
                <label className={labelClass}>Create 4-Digit PIN</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={securityPin}
                  onChange={(e) =>
                    setSecurityPin(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  disabled={isPinLoading}
                  placeholder="0000"
                  className={`${inputClass} disabled:opacity-50 text-center text-2xl tracking-widest font-bold`}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  Use numbers only (0-9)
                </p>
              </div>

              {/* Confirm PIN Field */}
              <div className="space-y-1">
                <label className={labelClass}>Confirm PIN</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  disabled={isPinLoading}
                  placeholder="0000"
                  className={`${inputClass} disabled:opacity-50 text-center text-2xl tracking-widest font-bold`}
                />
              </div>

              {/* PIN Match Status */}
              {securityPin && confirmPin && (
                <div
                  className={`text-sm font-semibold ${securityPin === confirmPin ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {securityPin === confirmPin
                    ? "✓ PINs match"
                    : "✗ PINs do not match"}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={
                  isPinLoading ||
                  securityPin !== confirmPin ||
                  securityPin.length !== 4
                }
                type="submit"
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-8"
              >
                {isPinLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <KeyRound size={18} />
                    <span>Update Security PIN</span>
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-6">
                <CheckCircle className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                PIN Updated!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your security PIN has been saved securely.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-[2rem] border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Lock size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              Locked Out? (Complete Recovery Guide)
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              If you completely forget your password and can't access this page:
            </p>

            {/* Two Methods */}
            <div className="space-y-4 mt-4">
              {/* Method 1 - Authenticated */}
              <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-amber-100 dark:border-amber-500/10">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-2">
                  ✓ Method 1: Authenticated Reset (Fastest)
                </p>
                <ol className="text-xs text-amber-800 dark:text-amber-300 space-y-1 ml-4 list-decimal">
                  <li>
                    If you can still login with old password → use this form
                    immediately
                  </li>
                  <li>Enter current password, new password, confirm</li>
                  <li>Click "Update Password"</li>
                  <li>Login with new password ✓</li>
                </ol>
              </div>

              {/* Method 2 - Supabase */}
              <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-amber-100 dark:border-amber-500/10">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-2">
                  ✓ Method 2: Supabase Backup (Last Resort)
                </p>
                <ol className="text-xs text-amber-800 dark:text-amber-300 space-y-1 ml-4 list-decimal">
                  <li>
                    Go to{" "}
                    <span className="font-mono bg-amber-100 dark:bg-amber-500/20 px-1 rounded">
                      supabase.com
                    </span>
                  </li>
                  <li>
                    Navigate to <strong>Authentication → Users</strong>
                  </li>
                  <li>Find your admin email</li>
                  <li>Click three dots (⋯) → "Reset Password"</li>
                  <li>Check email for reset link</li>
                  <li>Click link and set new password</li>
                  <li>Login with new password ✓</li>
                </ol>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-semibold">
                  ⚠️ Note: Supabase emails are limited to 2/hour. If rate
                  limited, wait 1 hour before retrying.
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                💡 Best Practice: Use this authenticated form regularly to
                update your password. It's faster and doesn't have email rate
                limits!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
