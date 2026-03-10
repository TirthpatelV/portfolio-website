"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContactMessage } from "@/types";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !read }),
      });

      if (!response.ok) throw new Error("Failed to update message");
      toast.success("Message updated!");
      fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete message");
      toast.success("Message deleted!");
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {unreadCount > 0
              ? <><span className="text-blue-600 dark:text-blue-400 font-semibold">{unreadCount} unread</span> · {messages.length} total</>
              : `${messages.length} message${messages.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <Mail size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl border bg-white dark:bg-gray-800/50 overflow-hidden transition-all ${
                !message.read
                  ? "border-blue-300 dark:border-blue-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${!message.read ? "bg-blue-50 dark:bg-blue-950/40" : "bg-gray-100 dark:bg-gray-700"}`}>
                  {message.read
                    ? <MailOpen size={14} className="text-gray-400" />
                    : <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${!message.read ? "" : "text-gray-700 dark:text-gray-300"}`}>
                      {message.name}
                    </span>
                    {!message.read && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{message.email} · {new Date(message.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkRead(message.id, message.read); }}
                    className={`p-1.5 rounded-lg text-[11px] font-medium transition-colors ${message.read ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400" : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"}`}
                    title={message.read ? "Mark unread" : "Mark read"}
                  >
                    {message.read ? <Mail size={13} /> : <MailOpen size={13} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                  {expandedId === message.id
                    ? <ChevronUp size={14} className="text-gray-400 ml-1" />
                    : <ChevronDown size={14} className="text-gray-400 ml-1" />
                  }
                </div>
              </div>
              {/* Expanded body */}
              {expandedId === message.id && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{message.message}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <a
                      href={`mailto:${message.email}`}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Reply to {message.email} →
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
