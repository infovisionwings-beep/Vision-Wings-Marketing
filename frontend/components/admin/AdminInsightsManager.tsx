"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Loader2, RefreshCw } from "lucide-react";
import { getInsights, createInsight, deleteInsight } from "@/app/actions/insights";

interface InsightItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  content: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
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
    if (!confirm("Are you sure you want to delete this insight?")) return;
    try {
      await deleteInsight(id);
      setInsights((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete insight:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-h3 text-navy-950 font-bold">Insights & Articles</h2>
          <p className="text-navy-600 text-sm mt-1">
            Publish blog articles, thought leadership pieces, and industry insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInsightData}
            className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-bronze-500 transition-colors bg-white px-3.5 py-2 rounded-lg border border-navy-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-950 text-warm-50 text-sm font-medium hover:bg-navy-900 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Insight
          </button>
        </div>
      </div>

      {/* Insights List */}
      {isLoading ? (
        <div className="py-12 flex justify-center text-navy-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center border border-navy-100 text-navy-500">
          No insights published yet. Click "New Insight" to publish your first article.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-bronze-50 text-bronze-700 text-xs font-semibold">
                    {item.category}
                  </span>
                  <span className="text-xs text-navy-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy-950 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 line-clamp-3">{item.content}</p>
              </div>
              <div className="pt-3 border-t border-navy-100 flex items-center justify-between">
                <span className="text-xs font-mono text-navy-400">/{item.slug}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-navy-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-navy-950">Publish New Insight</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. 10 Rules of Strategic Branding"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-navy-200 focus:outline-none focus:border-bronze-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-navy-200 focus:outline-none focus:border-bronze-500 text-sm"
                >
                  <option value="Strategy">Strategy</option>
                  <option value="Design">Design</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase mb-1">Content</label>
                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-navy-200 focus:outline-none focus:border-bronze-500 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-navy-200 text-sm font-medium text-navy-700 hover:bg-navy-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-navy-950 text-warm-50 text-sm font-medium hover:bg-navy-900 transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
