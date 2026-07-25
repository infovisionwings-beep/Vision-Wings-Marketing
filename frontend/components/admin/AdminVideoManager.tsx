"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Film, Trash2, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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

  const uploadFile = (file: File) => {
    // Client-side validation
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

    const formData = new FormData();
    formData.append("video", file);
    formData.append("userId", "admin");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BACKEND_URL}/api/videos`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        fetchVideos();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          setUploadError(errData.error || "Upload failed.");
        } catch {
          setUploadError("Upload failed with status code " + xhr.status);
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadProgress(null);
      setUploadError("Network error occurred during video upload.");
    };

    xhr.send(formData);
  };

  // Delete Video
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
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
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-h3 text-navy-950 font-bold">Video Management</h2>
          <p className="text-navy-600 text-sm mt-1">
            Upload videos in MP4 format. System automatically transcodes to WebM (lightweight primary) and MP4 fallback, extracts a poster thumbnail, and uploads to cloud storage.
          </p>
        </div>
        <button
          onClick={fetchVideos}
          className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-bronze-500 transition-colors bg-white px-3.5 py-2 rounded-lg border border-navy-200 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-navy-200 hover:border-bronze-400 transition-all shadow-sm">
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-14 h-14 rounded-full bg-bronze-50 flex items-center justify-center text-bronze-500 mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-navy-950 mb-1">Upload New Video</h3>
          <p className="text-sm text-navy-600 mb-4">
            Drag & drop MP4 video file or click to browse (Max 100MB)
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
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 text-warm-50 font-medium cursor-pointer hover:bg-navy-900 transition-all shadow-md ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}
            {isUploading ? "Uploading..." : "Select MP4 File"}
          </label>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="w-full max-w-md mt-6 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-navy-700">
                <span>Uploading to Cloud Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-navy-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-bronze-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Videos List Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-navy-950">Uploaded Videos ({videos.length})</h3>

        {isLoading ? (
          <div className="py-12 flex justify-center text-navy-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center border border-navy-100 text-navy-500">
            No videos uploaded yet. Upload an MP4 video above to begin automated transcoding.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-navy-100 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Status Badge & Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-semibold text-navy-950 text-sm truncate max-w-[200px]" title={v.originalFileName}>
                      {v.originalFileName}
                    </span>

                    {v.status === "completed" && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}

                    {(v.status === "processing" || v.status === "queued" || v.status === "uploaded") && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {v.status === "processing" ? "Transcoding..." : "Queued"}
                      </span>
                    )}

                    {v.status === "failed" && (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </div>

                  {/* Player or Processing View */}
                  {v.status === "completed" ? (
                    <LazyVideoPlayer
                      webmUrl={v.webmPath}
                      mp4Url={v.mp4Path}
                      posterUrl={v.thumbnailPath}
                      title={v.originalFileName}
                    />
                  ) : v.status === "failed" ? (
                    <div className="aspect-video bg-red-50/50 rounded-xl border border-red-100 flex flex-col items-center justify-center p-6 text-center text-red-600">
                      <AlertCircle className="w-10 h-10 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-semibold mb-1">Processing Failed</p>
                      <p className="text-xs text-red-500 max-w-xs">{v.errorMessage || "Unknown transcoding error."}</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-navy-900 rounded-xl flex flex-col items-center justify-center p-6 text-center text-warm-50">
                      <Loader2 className="w-10 h-10 mb-3 animate-spin text-bronze-400" />
                      <p className="text-sm font-semibold">Transcoding in progress...</p>
                      <p className="text-xs text-navy-400 mt-1">Generating WebM & MP4 renditions + thumbnail</p>
                    </div>
                  )}
                </div>

                {/* Footer details & Actions */}
                <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500">
                  <div>
                    {v.durationSeconds && <span>Duration: {v.durationSeconds}s • </span>}
                    <span>{(v.originalSize / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>

                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 text-navy-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Video"
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
