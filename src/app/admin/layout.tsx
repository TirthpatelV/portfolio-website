"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Gauge,
  User,
  BookOpen,
  Briefcase,
  Zap,
  MessageSquare,
  Award,
  ChevronRight,
  ExternalLink,
  Square,
  Dot,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteModalProvider } from "@/lib/deleteModal";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/about", label: "About", icon: Gauge },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";
  const isRecoveryPage = pathname === "/admin/recovery";
  const isResetConfirmPage = pathname === "/admin/reset-password-confirm";
  const isForgotPasswordPinPage = pathname === "/admin/forgot-password-pin";
  const isPublicPage =
    isLoginPage ||
    isRecoveryPage ||
    isResetConfirmPage ||
    isForgotPasswordPinPage;

  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      if (large) setIsSidebarOpen(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isPublicPage) {
      setIsLoading(false);
      return;
    }
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) router.push("/admin/login");
        else setUser(session.user);
      } catch (error) {
        router.push("/admin/login");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router, isPublicPage]);

  // Fetch unread message count
  useEffect(() => {
    if (isPublicPage || !user) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages");
        if (response.ok) {
          const data = await response.json();
          const unread = data.filter((m: any) => !m.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isPublicPage, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
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

  if (isPublicPage) return children;
  if (!user) return null;

  return (
    <DeleteModalProvider>
      <div className="flex h-screen bg-slate-50/50 dark:bg-[#0f1115] text-slate-900 dark:text-slate-100">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside
          className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-[#16191f] border-r border-slate-200 dark:border-white/[0.05] 
        transition-all duration-300 ease-in-out z-50 flex flex-col
        ${isLargeScreen ? "translate-x-0" : isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
        >
          {/* Brand Section */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-white/[0.05]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Square size={16} className="fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight">
                  Core<span className="text-indigo-500 font-medium">Admin</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Management
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
              Nav Menu
            </p>
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <link.icon
                    size={17}
                    className={
                      isActive
                        ? "text-indigo-500"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  <span className="flex-1">{link.label}</span>
                  {link.href === "/admin/messages" && unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold"
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="w-1 h-5 bg-indigo-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom User Profile */}
          <div className="p-4 border-t border-slate-100 dark:border-white/[0.05] bg-slate-50/30 dark:bg-black/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400">
                {user?.email?.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate tracking-tight">
                  {user?.email?.split("@")[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">
                  Admin
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-20 bg-white/50 dark:bg-[#16191f]/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.05] flex items-center justify-between px-6 lg:px-10 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                <Menu size={22} />
              </button>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1">
                  {adminLinks.find((l) => l.href === pathname)?.label ||
                    "Dashboard"}
                </h1>
                <div className="flex items-center text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                  <Dot className="animate-pulse" size={20} /> Online
                </div>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-500 transition-all"
            >
              Visit Site <ExternalLink size={12} />
            </Link>
          </header>

          {/* Dynamic Main Body */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </DeleteModalProvider>
  );
}
