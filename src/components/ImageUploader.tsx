"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useNotification } from "@/lib/useNotification";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  folder?: string;
  required?: boolean;
  labelClass?: string;
  inputClass?: string;
}

export function ImageUploader({
  value,
  onChange,
  label,
  placeholder = "https://...",
  folder = "project-images",
  required = false,
  labelClass,
  inputClass,
}: ImageUploaderProps) {
  const notification = useNotification();
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showUploadMode, setShowUploadMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notification.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      notification.success("Image uploaded successfully!");
      setShowUploadMode(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      notification.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  // Only show image after it loads
  useEffect(() => {
    if (value) {
      setImageLoading(true);
    }
  }, [value]);

  return (
    <div className="space-y-3">
      {label && <label className={labelClass}>{label}</label>}

      {/* Tabs for URL/Upload mode */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setShowUploadMode(false)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            !showUploadMode
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setShowUploadMode(true)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            showUploadMode
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
          }`}
        >
          Upload
        </button>
      </div>

      {/* URL Input Mode */}
      {!showUploadMode && (
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          required={required && !value}
          placeholder={placeholder}
          className={inputClass}
        />
      )}

      {/* Upload Mode */}
      {showUploadMode && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
              isUploading
                ? "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed opacity-60"
                : "border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 hover:border-indigo-400 dark:hover:border-indigo-500/50"
            }`}
          >
            <Upload
              size={18}
              className={isUploading ? "text-slate-400" : "text-indigo-600"}
            />
            <span
              className={
                isUploading
                  ? "text-slate-500"
                  : "text-indigo-700 dark:text-indigo-400"
              }
            >
              {isUploading ? "Uploading..." : "Click to upload or drag image"}
            </span>
          </button>
          {value && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Current image URL set from upload
            </div>
          )}
        </div>
      )}

      {/* Image Preview with Skeleton Loader */}
      {value && (
        <div className="space-y-2">
          <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden aspect-video">
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 animate-pulse" />
            )}
            <img
              src={value}
              alt="Preview"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>

          {/* Clear button */}
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear image
          </button>
        </div>
      )}
    </div>
  );
}
