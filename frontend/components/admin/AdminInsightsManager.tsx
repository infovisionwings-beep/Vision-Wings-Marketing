"use client";

// Reading this as: Executive editorial dispatch console for a branding agency, using newspaper wire column formatting and high-contrast publication modals.
// DESIGN_VARIANCE: 7
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 6

import React, { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Loader2, RefreshCw, Sparkles, BookOpen, Clock, ArrowUpRight } from "lucide-react";
import { getInsights, createInsight, deleteInsight } from "@/app/actions/insights";

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

export const AdminInsightsManager: React.FC = () => {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Strategy",
    content: "",
    coverImage: "",
    isPublished: true,
  });

  const fetchInsightData = async () => {
    try {
      setIsLoading(true);
      const data = await getInsights();
      setInsights(data || []);
    } catch (err) {
      console.error("Failed to load insights:", err);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      setIsSubmitting(true);
      await createInsight(formData);
      setShowModal(false);
      setFormData({
        title: "",
        slug: "",
        category: "Strategy",
        content: "",
        coverImage: "",
        isPublished: true,
      });
      fetchInsightData();
    } catch (err) {
      console.error("Failed to create insight:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to retract and delete this published essay?")) return;
    try {
      await deleteInsight(id);
      setInsights((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete insight:", err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-200/80 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-bronze-600 block mb-1">
            EDITORIAL WIRE / 02
          </span>
          <h1 className="text-display sm:text-h2 font-bold text-navy-950 tracking-tight">
            Strategic Essays &amp; Intel
          </h1>
          <p className="text-navy-600 text-sm mt-1 max-w-xl leading-relaxed">
            Publish high-contrast thought leadership. Long-form articles render on the homepage newspaper wire with automatic reading-time calculation and custom slug routing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInsightData}
            className="flex items-center gap-2 text-xs font-mono font-bold text-navy-900 hover:text-bronze-600 active:scale-[0.98] active:-translate-y-[1px] transition-all bg-warm-200/80 hover:bg-warm-200 px-4 py-2.5 rounded-lg border border-navy-300/40 shadow-sm"
            data-interactive
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SYNC WIRE</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-950 text-warm-50 text-xs font-mono font-bold hover:bg-navy-900 active:scale-[0.98] active:-translate-y-[1px] transition-all shadow-lg"
            data-interactive
          >
            <Plus className="w-4 h-4 text-bronze-400" />
            <span>NEW ESSAY DISPATCH</span>
          </button>
        </div>
      </div>

      {/* Editorial Wire Columns List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 font-bold text-navy-950">Published Wire ({insights.length})</h3>
          <span className="text-xs font-mono text-navy-500">PUBLIC ROUNTING: `/insights/[slug]`</span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-navy-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-bronze-600" />
            <span className="text-xs font-mono">LOADING EDITORIAL WIRE FROM DATABASE...</span>
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-warm-50 p-12 rounded-2xl text-center border border-navy-200/80 text-navy-500 font-mono text-xs">
            No editorial essays published yet. Click "NEW ESSAY DISPATCH" above to publish your first article.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.map((item, idx) => {
              const wordCount = item.content?.split(/\s+/).length || 100;
              const readTime = Math.max(1, Math.ceil(wordCount / 200));

              return (
                <div
                  key={item.id}
                  className="bg-warm-50 p-8 rounded-2xl border border-navy-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy-950 via-bronze-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-navy-950 text-warm-50 font-mono text-[11px] font-semibold tracking-wider uppercase">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-navy-500 flex items-center gap-1 bg-warm-200/60 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-bronze-700" /> {readTime} MIN READ
                        </span>
                      </div>
                      <span className="text-xs font-mono text-navy-400 font-medium">
                        DISPATCH 0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-h4 font-bold text-navy-950 group-hover:text-bronze-700 transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-navy-600 line-clamp-3 leading-relaxed font-sans">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy-200/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-navy-500 truncate max-w-[200px]" title={`/insights/${item.slug}`}>
                      URL: /insights/{item.slug}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-navy-400 hover:text-red-700 hover:bg-red-100/80 rounded-lg transition-all active:scale-95"
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

      {/* Executive Publication Dossier Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-950 text-warm-50 rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-navy-800 space-y-6 relative overflow-hidden">
            
            {/* Ambient copper glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-bronze-500/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-navy-800 pb-4 relative z-10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 block mb-1">
                  NEW DISPATCH DOSSIER
                </span>
                <h3 className="text-h3 font-bold text-warm-50">Publish Thought Leadership</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-bronze-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-warm-50 focus:outline-none focus:border-bronze-500 text-sm font-medium transition-colors placeholder:text-navy-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2">
                    Discipline Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-warm-50 focus:outline-none focus:border-bronze-500 text-sm font-medium transition-colors"
                  >
                    <option value="Strategy">Strategy</option>
                    <option value="Design">Design</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2">
                    Generated Routing Slug
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.slug || "(auto-generated)"}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-navy-800/60 text-bronze-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy-300 uppercase tracking-wider mb-2">
                  Editorial Body Content (Markdown Supported)
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your comprehensive thought leadership essay here..."
                  className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-warm-50 focus:outline-none focus:border-bronze-500 text-sm leading-relaxed resize-none transition-colors placeholder:text-navy-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-navy-800 text-xs font-mono font-bold text-navy-300 hover:bg-navy-900 hover:text-warm-50 transition-all active:scale-[0.98]"
                >
                  CANCEL DISPATCH
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-bronze-600 to-bronze-500 text-warm-50 text-xs font-mono font-bold hover:from-bronze-500 hover:to-bronze-400 transition-all flex items-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "TRANSMITTING..." : "PUBLISH TO WIRE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
