"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, Edit3, FileText, Loader2, RefreshCw, 
  Sparkles, BookOpen, Clock, ArrowUpRight, CheckCircle2, AlertCircle 
} from "lucide-react";

interface InsightItem {
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

export const AdminInsightsManager: React.FC = () => {
  const router = useRouter();
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

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

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you certain you wish to delete "${title}"? This action cannot be reversed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/insights/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInsights((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete dispatch.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const filteredInsights = insights.filter((item) => {
    if (filter === "published") return item.isPublished;
    if (filter === "drafts") return !item.isPublished;
    return true;
  });

  const publishedCount = insights.filter((i) => i.isPublished).length;
  const draftCount = insights.filter((i) => !i.isPublished).length;

  return (
    <div className="space-y-8 text-navy-950 pb-20">
      
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-navy-200 shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-bronze-600 block mb-1">
            EDITORIAL CONSOLE / LIGHT SCHEME
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight font-display">
            Thinking &amp; Perspectives Archive
          </h1>
          <p className="text-navy-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Manage your agency&apos;s strategic essays, thought leadership, and cultural telemetry. Create new dispatches on standalone editing pages with popup media modals.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchInsightData}
            title="Refresh database archive"
            className="p-3 rounded-2xl bg-warm-50 text-navy-700 hover:text-navy-950 hover:bg-warm-100 border border-navy-200 transition-all shadow-sm active:scale-95 flex-shrink-0"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin text-bronze-600" : ""}`} />
          </button>
          
          <button
            onClick={() => router.push("/admin/insights/new")}
            className="w-full sm:w-auto px-6 py-3.5 bg-navy-950 hover:bg-navy-900 text-white font-mono text-xs font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-bronze-400" />
            <span>+ NEW DISPATCH DOSSIER (PAGE)</span>
          </button>
        </div>
      </div>

      {/* Telemetry Bar & Filter Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-navy-500 block">Total Dispatches</span>
            <span className="text-2xl font-bold font-display text-navy-950">{insights.length}</span>
          </div>
          <BookOpen className="w-8 h-8 text-bronze-500/20" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-navy-500 block">Publicly Exhibitioned</span>
            <span className="text-2xl font-bold font-display text-emerald-700">{publishedCount}</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/20" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-navy-500 block">Internal Drafts</span>
            <span className="text-2xl font-bold font-display text-amber-700">{draftCount}</span>
          </div>
          <Clock className="w-8 h-8 text-amber-500/20" />
        </div>

        <div className="bg-white p-2 rounded-2xl border border-navy-200 shadow-sm flex items-center justify-around gap-1 font-mono text-xs font-bold">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-3 rounded-xl transition-all ${
              filter === "all" ? "bg-navy-950 text-white shadow" : "text-navy-600 hover:bg-warm-50"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`flex-1 py-3 rounded-xl transition-all ${
              filter === "published" ? "bg-navy-950 text-white shadow" : "text-navy-600 hover:bg-warm-50"
            }`}
          >
            LIVE
          </button>
          <button
            onClick={() => setFilter("drafts")}
            className={`flex-1 py-3 rounded-xl transition-all ${
              filter === "drafts" ? "bg-navy-950 text-white shadow" : "text-navy-600 hover:bg-warm-50"
            }`}
          >
            DRAFTS
          </button>
        </div>
      </div>

      {/* Archive List Grid */}
      <div className="bg-white rounded-3xl border border-navy-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-navy-200 bg-warm-50/50 flex items-center justify-between text-xs font-mono font-bold text-navy-600 uppercase tracking-wider">
          <span>Dossier Archive List</span>
          <span>Showing {filteredInsights.length} of {insights.length}</span>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-navy-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-bronze-600" />
            <span className="text-xs font-mono font-bold">SYNCHRONIZING EDITORIAL ARCHIVE...</span>
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="py-20 text-center text-navy-400 font-mono text-xs p-6">
            No dispatches matching the selected filter criteria. Click &ldquo;+ NEW DISPATCH DOSSIER&rdquo; above to create one on a standalone page.
          </div>
        ) : (
          <div className="divide-y divide-navy-100">
            {filteredInsights.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-warm-50/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Left Info & Thumb */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-navy-100 border border-navy-200 flex-shrink-0 relative">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy-400 font-mono text-[10px]">NO IMG</div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-bronze-50 border border-bronze-200 text-bronze-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.isPublished ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold uppercase">
                          ● PUBLIC
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-mono text-[10px] font-bold uppercase">
                          ○ DRAFT
                        </span>
                      )}
                      <span className="text-xs font-mono text-navy-400">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy-950 font-display truncate group-hover:text-bronze-600 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-mono text-navy-500">
                      <img 
                        src={item.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                        alt="Author" 
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>By {item.authorName || "Editorial Board"}</span>
                      {item.contributors && item.contributors.length > 0 && (
                        <span className="text-bronze-600">+{item.contributors.length} co-contributors</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <a
                    href={`/insights/${item.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View live essay on public site"
                    className="p-2.5 rounded-xl bg-warm-100 hover:bg-warm-200 text-navy-700 transition-colors border border-navy-200 flex items-center gap-1.5 font-mono text-xs font-bold"
                  >
                    <span>VIEW LIVE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => router.push(`/admin/insights/${item.id}/edit`)}
                    className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-bronze-400" />
                    <span>EDIT PAGE</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Delete dispatch"
                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 transition-colors"
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
