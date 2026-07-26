"use client";

// Reading this as: Executive editorial dispatch console for Thinking & Perspectives, featuring React Quill rich text editor and high-contrast publication modals.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 6

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Plus, Trash2, Edit3, FileText, Loader2, RefreshCw, Sparkles, BookOpen, Clock, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR window errors in Next.js 16 / React 19
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-xl bg-navy-900/80 border border-navy-800 flex items-center justify-center text-navy-400 font-mono text-xs">
      <Loader2 className="w-5 h-5 animate-spin mr-2 text-bronze-500" />
      LOADING RICH TEXT EDITOR...
    </div>
  )
});

interface InsightItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  coverImage?: string | null;
  content: string;
  isPublished?: boolean | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
}

const UNSPLASH_PRESETS = [
  { label: "Architecture", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80" },
  { label: "Minimal Studio", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" },
  { label: "Design Craft", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" },
  { label: "Spatial Property", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
  { label: "Abstract Texture", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" },
];

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold", "italic", "underline", "blockquote",
  "list",
  "link", "code-block"
];

export const AdminInsightsManager: React.FC = () => {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Strategy & Architecture",
    content: "",
    coverImage: UNSPLASH_PRESETS[0].url,
    isPublished: true,
  });

  const fetchInsightData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/insights");
      if (res.ok) {
        const data = await res.json();
        setInsights(data || []);
      } else {
        console.error("Failed to load essays from API:", res.statusText);
      }
    } catch (err) {
      console.error("Failed to load essays:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightData();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      category: "Strategy & Architecture",
      content: "<h3>1. Strategic Framework</h3><p>Start typing your comprehensive thought leadership perspective here...</p>",
      coverImage: UNSPLASH_PRESETS[0].url,
      isPublished: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: InsightItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Strategy & Architecture",
      content: item.content || "",
      coverImage: item.coverImage || UNSPLASH_PRESETS[0].url,
      isPublished: item.isPublished ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      setIsSubmitting(true);
      if (editingId) {
        const res = await fetch(`/api/insights/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update essay");
        }
      } else {
        const res = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create essay");
        }
      }
      setShowModal(false);
      setEditingId(null);
      fetchInsightData();
    } catch (err: any) {
      console.error("Failed to save essay:", err);
      alert("Error saving essay: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to retract and delete this published essay?")) return;
    try {
      const res = await fetch(`/api/insights/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInsights((prev) => prev.filter((item) => item.id !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert("Failed to delete essay: " + (errData.error || res.statusText));
      }
    } catch (err) {
      console.error("Failed to delete essay:", err);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Custom Quill Dark Mode Styling Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #334155;
          background-color: #1E293B;
        }
        .ql-toolbar.ql-snow .ql-stroke {
          stroke: #CBD5E1;
        }
        .ql-toolbar.ql-snow .ql-fill {
          fill: #CBD5E1;
        }
        .ql-toolbar.ql-snow .ql-picker-label {
          color: #CBD5E1;
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #334155;
          background-color: #0F172A;
          color: #F8FAFC;
          font-family: inherit;
          font-size: 0.95rem;
          min-height: 220px;
        }
        .ql-editor {
          min-height: 220px;
          line-height: 1.7;
        }
        .ql-editor h2, .ql-editor h3 {
          font-weight: 800;
          color: #F8FAFC;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ql-editor blockquote {
          border-left: 3px solid #B87333;
          padding-left: 1rem;
          color: #CBD5E1;
          font-style: italic;
        }
      `}} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-200/80 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-bronze-600 block mb-1">
            THINKING &amp; PERSPECTIVES / CONSOLE
          </span>
          <h1 className="text-display sm:text-h2 font-bold text-navy-950 tracking-tight">
            Essays &amp; Monograph Dispatch
          </h1>
          <p className="text-navy-600 text-sm mt-1 max-w-xl leading-relaxed">
            Publish high-contrast thought leadership with full rich-text formatting. Articles automatically synchronize with the Asymmetric Bento Grid and editorial reading pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInsightData}
            className="flex items-center gap-2 text-xs font-mono font-bold text-navy-900 hover:text-bronze-600 active:scale-[0.98] transition-all bg-warm-200/80 hover:bg-warm-200 px-4 py-2.5 rounded-xl border border-navy-300/40 shadow-sm"
            data-interactive
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SYNC ARCHIVE</span>
          </button>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 text-warm-50 text-xs font-mono font-bold hover:bg-navy-900 active:scale-[0.98] transition-all shadow-lg"
            data-interactive
          >
            <Plus className="w-4 h-4 text-bronze-400" />
            <span>NEW ESSAY DISPATCH</span>
          </button>
        </div>
      </div>

      {/* Editorial Archive List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 font-bold text-navy-950">Published Perspectives ({insights.length})</h3>
          <span className="text-xs font-mono text-navy-500">PUBLIC ROUTE: `/insights/[slug]`</span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-navy-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-bronze-600" />
            <span className="text-xs font-mono">LOADING PERSPECTIVES ARCHIVE FROM DATABASE...</span>
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-warm-50 p-12 rounded-2xl text-center border border-navy-200/80 text-navy-500 font-mono text-xs space-y-3">
            <p>No editorial essays published yet.</p>
            <button onClick={openNewModal} className="px-4 py-2 bg-navy-950 text-warm-50 rounded-lg text-xs font-bold font-mono">
              PUBLISH YOUR FIRST ESSAY
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.map((item, idx) => {
              const textOnly = item.content?.replace(/<[^>]*>?/gm, "") || "";
              const wordCount = textOnly.split(/\s+/).length || 100;
              const readTime = Math.max(1, Math.ceil(wordCount / 200));

              return (
                <div
                  key={item.id}
                  className="bg-warm-50 p-8 rounded-3xl border border-navy-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy-950 via-bronze-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-navy-950 text-warm-50 font-mono text-[11px] font-semibold tracking-wider uppercase">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-navy-500 flex items-center gap-1 bg-warm-200/60 px-2.5 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-bronze-700" /> {readTime} MIN READ
                        </span>
                      </div>
                      <span className="text-xs font-mono text-navy-400 font-medium">
                        DISPATCH 0{idx + 1}
                      </span>
                    </div>

                    {item.coverImage && (
                      <div className="w-full h-40 rounded-2xl overflow-hidden bg-navy-900 border border-navy-200/60">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-bold font-display text-navy-950 group-hover:text-bronze-700 transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-navy-600 line-clamp-3 leading-relaxed font-sans">
                        {textOnly || "No text content available."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy-200/80 flex items-center justify-between text-xs">
                    <a 
                      href={`/insights/${item.slug}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-mono text-bronze-600 hover:underline flex items-center gap-1"
                    >
                      <span>VIEW LIVE</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-navy-600 hover:text-bronze-600 hover:bg-warm-200 rounded-xl transition-all active:scale-95 flex items-center gap-1 font-mono text-xs font-bold"
                        title="Edit essay with React Quill"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-navy-400 hover:text-red-700 hover:bg-red-100/80 rounded-xl transition-all active:scale-95"
                        title="Retract and delete essay"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* React Quill Publication Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-navy-950 text-warm-50 rounded-3xl max-w-3xl w-full p-8 sm:p-10 shadow-2xl border border-navy-800 space-y-6 relative overflow-hidden my-8">
            
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-bronze-500/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-navy-800 pb-4 relative z-10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 block mb-1">
                  {editingId ? "EDITING DISPATCH DOSSIER" : "NEW DISPATCH DOSSIER"}
                </span>
                <h3 className="text-2xl font-bold font-display text-warm-50">
                  {editingId ? "Update Perspective" : "Publish Thought Leadership"}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-bronze-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2">
                  Essay Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. The Architecture of Anti-Slop Digital Experiences"
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-warm-50 focus:outline-none focus:border-bronze-500 text-base font-medium transition-colors placeholder:text-navy-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2">
                    Discipline Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-warm-50 focus:outline-none focus:border-bronze-500 text-sm font-medium transition-colors"
                  >
                    <option value="Strategy & Architecture">Strategy &amp; Architecture</option>
                    <option value="Monograph & Dispatch">Monograph &amp; Dispatch</option>
                    <option value="Design Craft">Design Craft</option>
                    <option value="Property Marketing">Property Marketing</option>
                    <option value="Growth Engineering">Growth Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2">
                    Routing Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-bronze-400 font-mono text-xs focus:outline-none focus:border-bronze-500"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Cover Image URL</span>
                  <span className="text-[10px] text-navy-400 font-normal">Pick preset or paste URL</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {UNSPLASH_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, coverImage: preset.url }))}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                        formData.coverImage === preset.url
                          ? "bg-bronze-600 border-bronze-500 text-warm-50"
                          : "bg-navy-900 border-navy-800 text-navy-300 hover:border-navy-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-warm-50 font-mono text-xs focus:outline-none focus:border-bronze-500"
                />
              </div>

              {/* React Quill WYSIWYG Editor */}
              <div>
                <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Editorial Body Content (Rich Text)</span>
                  <span className="text-[10px] text-bronze-400 font-normal">Powered by React Quill</span>
                </label>
                <div className="rounded-xl overflow-hidden shadow-inner">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your comprehensive thought leadership perspective here..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl border border-navy-800 text-xs font-mono font-bold text-navy-300 hover:bg-navy-900 hover:text-warm-50 transition-all active:scale-[0.98]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-bronze-600 to-bronze-500 text-warm-50 text-xs font-mono font-bold hover:from-bronze-500 hover:to-bronze-400 transition-all flex items-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "SAVING TO WIRE..." : editingId ? "UPDATE PERSPECTIVE" : "PUBLISH TO WIRE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
