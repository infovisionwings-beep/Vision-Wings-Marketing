"use client";

// Reading this as: Executive cloud video pipeline manager for an elite branding agency, using dark-mode dropzone chrome, tactile upload physics, and high-contrast video exhibition cards.
// DESIGN_VARIANCE: 7
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 5

import React, { useState, useEffect, useRef } from "react";
import { Upload, Film, Trash2, CheckCircle2, AlertCircle, Loader2, RefreshCw, Terminal } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { LazyVideoPlayer } from "../video/LazyVideoPlayer";

interface VideoRecord {
  id: string;
  userId: string;
  originalFileName: string;
  originalSize: number;
  durationSeconds: string | null;
  status: "uploaded" | "queued" | "processing" | "completed" | "failed";
  inputPath: string;
  webmPath: string | null;
  mp4Path: string | null;
  thumbnailPath: string | null;
  errorMessage: string | null;
  createdAt: string;
  processedAt: string | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const AdminVideoManager: React.FC = () => {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all videos from backend API
  const fetchVideos = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for active/processing videos
  useEffect(() => {
    fetchVideos();
    const interval = setInterval(() => {
      fetchVideos();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const allowedExts = [".mp4", ".mov", ".webm"];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      setUploadError("Invalid file type. Only MP4, MOV, and WebM videos are allowed.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError("File size exceeds 100MB limit.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/videos/upload",
        onUploadProgress: (progress) => {
          setUploadProgress(progress.percentage);
        },
      });

      await fetch(`${BACKEND_URL}/api/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputUrl: newBlob.url,
          originalFileName: file.name,
          originalSize: file.size,
          userId: "admin",
        }),
      });

      setIsUploading(false);
      setUploadProgress(null);
      fetchVideos();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error("Vercel Blob direct upload error:", err);
      setIsUploading(false);
      setUploadProgress(null);
      setUploadError(err.message || "Failed to upload video.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video asset from cloud storage and database?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-200/80 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-bronze-600 block mb-1">
            CLOUD PIPELINE / 03
          </span>
          <h1 className="text-display sm:text-h2 font-bold text-navy-950 tracking-tight">
            Video Transcoding Engine
          </h1>
          <p className="text-navy-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Upload source MP4/MOV media. Serverless workers automatically transcode into WebM (VP9 primary) and MP4 (H.264 fallback), extracting poster thumbnails with zero local disk footprint.
          </p>
        </div>
        <button
          onClick={fetchVideos}
          className="flex items-center gap-2 text-xs font-mono font-bold text-navy-900 hover:text-bronze-600 active:scale-[0.98] active:-translate-y-[1px] transition-all bg-warm-200/80 hover:bg-warm-200 px-4 py-2.5 rounded-lg border border-navy-300/40 shadow-sm"
          data-interactive
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>SYNC TELEMETRY</span>
        </button>
      </div>

      {/* Executive Dark Cloud Dropzone */}
      <div className="bg-navy-950 text-warm-50 p-8 md:p-12 rounded-2xl border-2 border-dashed border-navy-800 hover:border-bronze-500 transition-all shadow-2xl relative overflow-hidden group">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-bronze-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-navy-700 flex items-center justify-center text-bronze-400 mb-6 group-hover:scale-110 group-hover:border-bronze-500 transition-all shadow-inner">
            <Upload className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-bronze-400 mb-2">VERCEL BLOB CDN + UPSTASH QUEUE</span>
          <h3 className="text-h3 font-bold text-warm-50 mb-2">Deploy Media Asset</h3>
          <p className="text-sm text-navy-300 mb-8 leading-relaxed">
            Drag &amp; drop high-resolution MP4, MOV, or WebM video file, or initialize local browser selection (Max 100MB payload).
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="admin-video-file-input"
          />

          <label
            htmlFor="admin-video-file-input"
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-warm-50 text-navy-950 font-bold text-sm cursor-pointer hover:bg-warm-100 active:scale-[0.98] active:-translate-y-[1px] transition-all shadow-xl group/btn ${
              isUploading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-bronze-600" /> : <Film className="w-5 h-5 text-bronze-600 group-hover/btn:rotate-12 transition-transform" />}
            <span>{isUploading ? "TRANSMITTING TO CLOUD..." : "INITIALIZE UPLOAD"}</span>
          </label>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="w-full max-w-md mt-8 space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold text-bronze-400">
                <span>BUFFERING PAYLOAD TO CDN...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-3 bg-navy-900 rounded-full overflow-hidden border border-navy-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-bronze-600 to-bronze-400 transition-all duration-300 rounded-full shadow-sm"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mt-6 p-4 rounded-xl bg-red-950/90 text-red-200 border border-red-800 text-xs font-mono flex items-center gap-3 w-full">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-left">{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Videos List Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 font-bold text-navy-950">Indexed Cloud Assets ({videos.length})</h3>
          <span className="text-xs font-mono text-navy-500">AUTO-REFRESHING EVERY 4S</span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-navy-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-bronze-600" />
            <span className="text-xs font-mono">SYNCHRONIZING WITH NEON DATABASE...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-warm-50 p-12 rounded-2xl text-center border border-navy-200/80 text-navy-500 font-mono text-xs">
            No media assets recorded in database yet. Upload a video above to trigger automated worker transcoding.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((v) => (
              <div
                key={v.id}
                className="bg-warm-50 rounded-2xl border border-navy-200/80 p-6 shadow-md hover:shadow-xl transition-all space-y-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Status Badge & Header */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-navy-950 text-base truncate max-w-[220px]" title={v.originalFileName}>
                      {v.originalFileName}
                    </span>

                    {v.status === "completed" && (
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CDN READY
                      </span>
                    )}

                    {(v.status === "processing" || v.status === "queued" || v.status === "uploaded") && (
                      <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        {v.status === "processing" ? "WORKER TRANSCODING..." : "BULLMQ QUEUED"}
                      </span>
                    )}

                    {v.status === "failed" && (
                      <span className="px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-800 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" /> TRANSCODE FAILED
                      </span>
                    )}
                  </div>

                  {/* Player View */}
                  <div className="rounded-xl overflow-hidden border border-navy-900/10 shadow-inner bg-navy-950">
                    <LazyVideoPlayer
                      webmUrl={v.webmPath}
                      mp4Url={v.mp4Path || v.inputPath}
                      posterUrl={v.thumbnailPath}
                      title={v.originalFileName}
                    />
                  </div>
                </div>

                {/* Footer details & Actions */}
                <div className="pt-4 border-t border-navy-200/80 flex items-center justify-between text-xs font-mono text-navy-500">
                  <div className="flex items-center gap-3">
                    {v.durationSeconds && <span>DUR: {v.durationSeconds}s</span>}
                    <span>SIZE: {(v.originalSize / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>

                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 text-navy-400 hover:text-warm-50 hover:bg-red-900/90 rounded-lg transition-all active:scale-95"
                    title="Delete Video from Cloud CDN and DB"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
