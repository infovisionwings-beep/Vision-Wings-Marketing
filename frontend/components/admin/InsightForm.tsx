"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Save, X, Image as ImageIcon, Film, Plus, Trash2, Loader2, 
  Sparkles, User, Users, Calendar, Tag, FileText, ArrowLeft, CheckCircle2 
} from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { AdminPhotoManager } from "./AdminPhotoManager";
import { AdminVideoManager } from "./AdminVideoManager";

// Dynamically import ReactQuill to avoid SSR window errors in Next.js 16 / React 19
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-2xl bg-warm-100/80 border border-navy-200 flex items-center justify-center text-navy-500 font-mono text-xs">
      <Loader2 className="w-5 h-5 animate-spin mr-2 text-bronze-600" />
      LOADING RICH TEXT EDITOR...
    </div>
  )
});

interface InsightRecord {
  id: number;
  title: string;
  slug: string;
  category: string;
  coverImage?: string | null;
  content: string;
  authorName?: string | null;
  authorRole?: string | null;
  authorAvatar?: string | null;
  contributors?: { name: string; role: string; avatar: string; email?: string }[] | null;
  isPublished?: boolean | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
}

interface InsightFormProps {
  insight?: InsightRecord;
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

export const InsightForm: React.FC<InsightFormProps> = ({ insight }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [adminProfiles, setAdminProfiles] = useState<{email: string; name: string; role: string; avatar: string}[]>([]);
  
  // Modal Popup States
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<string | null>(null); // "cover" | "author" | "contributor-idx" | "content"
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [formData, setFormData] = useState({
    title: insight?.title || "",
    slug: insight?.slug || "",
    category: insight?.category || "Strategy & Architecture",
    content: insight?.content || "",
    coverImage: insight?.coverImage || UNSPLASH_PRESETS[0].url,
    authorName: insight?.authorName || "Amélie Laurent",
    authorRole: insight?.authorRole || "Partner, Brand Architecture",
    authorAvatar: insight?.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    contributors: (insight?.contributors || []) as { name: string; role: string; avatar: string; email?: string }[],
    isPublished: insight?.isPublished !== undefined ? Boolean(insight.isPublished) : true,
    publishedAt: insight?.publishedAt ? new Date(insight.publishedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetch("/api/admins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAdminProfiles(data);
      })
      .catch((err) => console.error("Failed to load admin profiles:", err));
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const addContributor = (profile?: {name: string; role: string; avatar: string; email?: string}) => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        contributors: [...prev.contributors, { name: profile.name, role: profile.role, avatar: profile.avatar, email: profile.email }],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        contributors: [
          ...prev.contributors,
          { name: "New Contributor", role: "Editorial Contributor", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
        ],
      }));
    }
  };

  const removeContributor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contributors: prev.contributors.filter((_, i) => i !== index),
    }));
  };

  const updateContributor = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.contributors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, contributors: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and Content are required.");
      return;
    }

    setIsLoading(true);
    try {
      const url = insight ? `/api/insights/${insight.id}` : "/api/insights";
      const method = insight ? "PUT" : "POST";

      const payload = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : new Date().toISOString(),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/insights");
        router.refresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save dispatch: ${errData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving the dispatch dossier.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between border-b border-navy-200 pb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/insights")}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-navy-600 hover:text-bronze-600 transition-colors py-2 px-3 rounded-lg hover:bg-warm-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Insights Archive</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bronze-50 border border-bronze-200 text-[11px] font-mono font-bold text-bronze-700 tracking-wider uppercase">
            ⚡ LIGHT SCHEME STANDALONE EDITING PAGE
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-navy-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-10 text-navy-950">
        
        {/* Title & Slug Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-700 mb-2">
              Dispatch Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. The Architecture of Silence: Designing Luxury in 2026"
              className="w-full px-5 py-4 rounded-2xl border border-navy-300 bg-warm-50/50 text-navy-950 font-display text-xl sm:text-2xl font-bold focus:outline-none focus:border-bronze-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-700 mb-2">
                URL Slug / Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-navy-300 bg-warm-50/50 text-navy-950 font-mono text-sm focus:outline-none focus:border-bronze-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-700 mb-2">
                Strategic Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-navy-300 bg-warm-50/50 text-navy-950 font-semibold text-sm focus:outline-none focus:border-bronze-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Strategy & Architecture">Strategy &amp; Architecture</option>
                <option value="Design Craft">Design Craft &amp; Interaction</option>
                <option value="Brand Ecosystems">Brand Ecosystems</option>
                <option value="Cultural Telemetry">Cultural Telemetry</option>
                <option value="Engineering & Performance">Engineering &amp; Performance</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-navy-200" />

        {/* Cover Photo Pipeline Popup Trigger */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-700">
                Hero Cover Photo Asset *
              </label>
              <span className="text-xs text-navy-500">The primary 16:9 cinematic poster for this dispatch</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhotoTarget("cover");
                setShowPhotoModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bronze-600 hover:bg-bronze-700 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              <ImageIcon className="w-4 h-4" />
              <span>⚡ OPEN PHOTO PIPELINE (POPUP MODAL)</span>
            </button>
          </div>

          <input
            type="text"
            required
            value={formData.coverImage}
            onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl border border-navy-300 bg-warm-50/50 text-navy-950 font-mono text-xs focus:outline-none focus:border-bronze-500 focus:bg-white transition-all"
          />

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono font-bold uppercase text-navy-500 mr-1">Presets:</span>
            {UNSPLASH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, coverImage: p.url }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  formData.coverImage === p.url
                    ? "bg-navy-950 text-white border-navy-950 font-bold shadow-sm"
                    : "bg-warm-100/70 text-navy-700 border-navy-300 hover:bg-warm-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {formData.coverImage && (
            <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden border border-navy-200 shadow-md relative bg-navy-900 mt-2">
              <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-navy-950/80 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider">
                Hero Preview
              </div>
            </div>
          )}
        </div>

        <hr className="border-navy-200" />

        {/* Lead Author / Editorial Director */}
        <div className="space-y-4 bg-warm-50/80 p-6 rounded-2xl border border-navy-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-200 pb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-navy-950 flex items-center gap-2">
                <User className="w-4 h-4 text-bronze-600" />
                <span>Author / Lead Editorial Director</span>
              </h4>
              <p className="text-xs text-navy-500 mt-0.5">Primary author displayed on the bottom-left of the poster</p>
            </div>
            
            {/* Admin Board Dropdown Selector */}
            {adminProfiles.length > 0 && (
              <select
                onChange={(e) => {
                  const selected = adminProfiles.find((p) => p.email === e.target.value);
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      authorName: selected.name || selected.email,
                      authorRole: selected.role || "Lead Editorial Director",
                      authorAvatar: selected.avatar || prev.authorAvatar,
                    }));
                  }
                }}
                defaultValue=""
                className="px-3.5 py-2 rounded-xl bg-white text-navy-950 font-mono text-xs font-bold border border-navy-300 shadow-sm focus:outline-none focus:border-bronze-500 cursor-pointer"
              >
                <option value="" disabled>⚡ Select from Admin Board...</option>
                {adminProfiles.map((p, idx) => (
                  <option key={idx} value={p.email}>
                    {p.name} ({p.role}) - {p.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-navy-700 mb-1">Author Name</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-300 bg-white text-navy-950 text-sm font-semibold focus:outline-none focus:border-bronze-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-navy-700 mb-1">Editorial Title / Role</label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorRole: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-300 bg-white text-navy-950 text-sm font-semibold focus:outline-none focus:border-bronze-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono font-bold uppercase text-navy-700">Avatar URL</label>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoTarget("author");
                    setShowPhotoModal(true);
                  }}
                  className="text-[10px] font-mono font-bold text-bronze-600 hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Pipeline Popup</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.authorAvatar}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorAvatar: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-300 bg-white text-navy-950 font-mono text-xs focus:outline-none focus:border-bronze-500"
              />
            </div>
          </div>
        </div>

        {/* Co-Contributors Section */}
        <div className="space-y-4 bg-warm-50/80 p-6 rounded-2xl border border-navy-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-200 pb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-navy-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-bronze-600" />
                <span>Co-Contributors &amp; Research Board</span>
              </h4>
              <p className="text-xs text-navy-500 mt-0.5">Additional team members displayed vertically aligned on the bottom-left of the poster</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {adminProfiles.length > 0 && (
                <select
                  onChange={(e) => {
                    const selected = adminProfiles.find((p) => p.email === e.target.value);
                    if (selected) {
                      addContributor({
                        name: selected.name || selected.email,
                        role: selected.role || "Research Contributor",
                        avatar: selected.avatar || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
                        email: selected.email
                      });
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                  className="px-3 py-2 rounded-xl bg-white text-navy-950 font-mono text-xs font-bold border border-navy-300 shadow-sm cursor-pointer focus:outline-none focus:border-bronze-500"
                >
                  <option value="" disabled>⚡ Add from Admin Board...</option>
                  {adminProfiles.map((p, idx) => (
                    <option key={idx} value={p.email}>
                      + {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => addContributor()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom</span>
              </button>
            </div>
          </div>

          {formData.contributors.length === 0 ? (
            <div className="text-center py-6 text-navy-400 font-mono text-xs bg-white/60 rounded-xl border border-dashed border-navy-200">
              No co-contributors added. Only the lead author will be displayed on the bottom-left poster stack.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.contributors.map((c, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl bg-white border border-navy-200 shadow-sm">
                  <img src={c.avatar || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-navy-200 flex-shrink-0" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Name"
                      value={c.name}
                      onChange={(e) => updateContributor(idx, "name", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-navy-200 text-xs font-semibold text-navy-950 focus:outline-none focus:border-bronze-500 bg-warm-50/50 focus:bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Research)"
                      value={c.role}
                      onChange={(e) => updateContributor(idx, "role", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-navy-200 text-xs font-semibold text-navy-950 focus:outline-none focus:border-bronze-500 bg-warm-50/50 focus:bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Avatar URL"
                        value={c.avatar}
                        onChange={(e) => updateContributor(idx, "avatar", e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-navy-200 text-xs font-mono text-navy-950 focus:outline-none focus:border-bronze-500 bg-warm-50/50 focus:bg-white flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoTarget(`contributor-${idx}`);
                          setShowPhotoModal(true);
                        }}
                        title="Select from Photo Pipeline Popup Modal"
                        className="p-1.5 rounded-lg bg-bronze-50 text-bronze-600 hover:bg-bronze-600 hover:text-white border border-bronze-200 transition-colors flex-shrink-0"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContributor(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors self-end sm:self-center flex-shrink-0"
                    title="Remove contributor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-navy-200" />

        {/* Editorial Body & Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-700">
                Editorial Manifesto Content (Rich Text / HTML) *
              </label>
              <span className="text-xs text-navy-500">Format headlines, quotes, and inject inline imagery or videos</span>
            </div>
            
            {/* Inline Pipeline Popup Modal Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhotoTarget("content");
                  setShowPhotoModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bronze-50 text-bronze-700 hover:bg-bronze-600 hover:text-white border border-bronze-300 font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>🖼️ Insert Image Asset (Popup)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-300 font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Film className="w-3.5 h-3.5" />
                <span>🎬 Insert Video Asset (Popup)</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-navy-300 overflow-hidden shadow-inner min-h-[420px] text-navy-950">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              modules={quillModules}
              formats={quillFormats}
              className="h-[360px] pb-12 text-navy-950"
              placeholder="Write or paste your editorial content here..."
            />
          </div>
        </div>

        <hr className="border-navy-200" />

        {/* Publish & Date Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-warm-50/80 p-6 rounded-2xl border border-navy-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="w-5 h-5 rounded accent-bronze-600 cursor-pointer"
            />
            <div>
              <label htmlFor="isPublished" className="text-sm font-bold text-navy-950 cursor-pointer block">
                Publish Immediately to Public Exhibition
              </label>
              <span className="text-xs text-navy-500">Uncheck to keep as an unpublished internal draft</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-navy-700 mb-2">
              Publication Date
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-300 bg-white text-navy-950 font-mono text-sm focus:outline-none focus:border-bronze-500"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-navy-200 flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/insights")}
            className="py-3.5 px-6 rounded-xl border border-navy-300 font-mono text-xs font-bold text-navy-700 hover:bg-warm-100 transition-all active:scale-[0.98]"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="py-3.5 px-8 rounded-xl bg-navy-950 text-white font-mono text-xs font-bold hover:bg-navy-900 transition-all shadow-lg flex items-center gap-2 active:scale-[0.98]"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-bronze-400" />}
            <Save className="w-4 h-4 text-bronze-400" />
            <span>{insight ? "UPDATE DISPATCH DOSSIER" : "PUBLISH DISPATCH DOSSIER"}</span>
          </button>
        </div>
      </form>

      {/* 🖼️ PHOTO PIPELINE POPUP MODAL OVERLAY (LIGHT COLOR SCHEME WRAPPER) */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-[70] bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border-2 border-navy-300 rounded-3xl p-6 sm:p-10 max-w-7xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-8 text-navy-950">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-navy-200">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-bronze-600 font-black block mb-1">
                  ⚡ POPUP MODAL PIPELINE / ASSET SELECTION (LIGHT SCHEME)
                </span>
                <h2 className="text-2xl font-bold text-navy-950 tracking-tight font-display">Select Cloud Image Asset</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-warm-100 hover:bg-red-50 text-navy-800 hover:text-red-700 border border-navy-300 hover:border-red-300 font-mono text-xs font-bold transition-all shadow-sm"
              >
                ✕ CLOSE POPUP MODAL
              </button>
            </div>
            <AdminPhotoManager
              isModal={true}
              onSelectPhoto={(url) => {
                if (photoTarget === "cover") {
                  setFormData((prev) => ({ ...prev, coverImage: url }));
                } else if (photoTarget === "author") {
                  setFormData((prev) => ({ ...prev, authorAvatar: url }));
                } else if (photoTarget?.startsWith("contributor-")) {
                  const idx = parseInt(photoTarget.split("-")[1], 10);
                  if (!isNaN(idx)) {
                    updateContributor(idx, "avatar", url);
                  }
                } else {
                  const imgTag = `\n\n<p><img src="${url}" alt="Exhibition Asset" style="max-width: 100%; border-radius: 12px; margin: 24px 0;" /></p>\n\n`;
                  setFormData((prev) => ({ ...prev, content: prev.content + imgTag }));
                }
                setShowPhotoModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🎬 VIDEO PIPELINE POPUP MODAL OVERLAY (LIGHT COLOR SCHEME WRAPPER) */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[70] bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border-2 border-navy-300 rounded-3xl p-6 sm:p-10 max-w-7xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-8 text-navy-950">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-navy-200">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-black block mb-1">
                  ⚡ POPUP MODAL PIPELINE / VIDEO SELECTION (LIGHT SCHEME)
                </span>
                <h2 className="text-2xl font-bold text-navy-950 tracking-tight font-display">Select Cloud Video Asset</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-warm-100 hover:bg-red-50 text-navy-800 hover:text-red-700 border border-navy-300 hover:border-red-300 font-mono text-xs font-bold transition-all shadow-sm"
              >
                ✕ CLOSE POPUP MODAL
              </button>
            </div>
            <AdminVideoManager
              isModal={true}
              onSelectVideo={(url) => {
                const videoTag = `\n\n<p><video src="${url}" controls style="max-width: 100%; border-radius: 12px; margin: 24px 0;"></video></p>\n\n`;
                setFormData((prev) => ({ ...prev, content: prev.content + videoTag }));
                setShowVideoModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
