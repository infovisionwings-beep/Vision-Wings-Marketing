"use client";

import { useState } from "react";
import { Link } from "@/components/ui/Link";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  Sparkles, 
  Eye, 
  Edit3, 
  Trash2, 
  Film, 
  Image as ImageIcon, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Search, 
  Star,
  ArrowUpDown,
  ExternalLink
} from "lucide-react";
import { deleteCampaign, updateCampaign, reorderCampaigns } from "@/app/actions/campaigns";
import { useRouter } from "next/navigation";

interface AdminCampaignManagerProps {
  initialCampaigns: any[];
}

const SECTION_TABS = [
  { id: "all", label: "All Campaigns" },
  { id: "hero", label: "Hero Featured" },
  { id: "samples", label: "Samples Grid" },
  { id: "showcases", label: "Campaign Showcases" },
  { id: "archive", label: "Campaign Archive" },
];

export default function AdminCampaignManager({ initialCampaigns }: AdminCampaignManagerProps) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter campaigns by tab & search
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesTab = activeTab === "all" || c.section === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleTogglePublish = async (campaign: any) => {
    setIsUpdating(true);
    const newStatus = campaign.publishStatus === "published" ? "draft" : "published";
    try {
      await updateCampaign(campaign.id, {
        ...campaign,
        publishStatus: newStatus,
      });
      setCampaigns((prev) =>
        prev.map((item) => (item.id === campaign.id ? { ...item, publishStatus: newStatus } : item))
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this campaign?")) return;
    setIsUpdating(true);
    try {
      await deleteCampaign(id);
      setCampaigns((prev) =>
        prev.map((item) => (item.id === id ? { ...item, publishStatus: "archived" } : item))
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStarred = async (campaign: any) => {
    setIsUpdating(true);
    const newStarred = !campaign.isStarred;
    try {
      await updateCampaign(campaign.id, {
        ...campaign,
        isStarred: newStarred,
      });
      setCampaigns((prev) =>
        prev.map((item) => (item.id === campaign.id ? { ...item, isStarred: newStarred } : item))
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle starred status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-navy-200/80 pb-8">
        <div>
          <h1 className="text-h2 font-bold text-navy-950 tracking-tight">Campaigns</h1>
          <p className="text-body-sm text-navy-600 mt-1">
            Create, edit, reorder, and publish marketing campaigns across all homepage sections.
          </p>
        </div>

        <Link href="/admin/campaigns/new">
          <button className="px-5 py-3 rounded-xl bg-navy-950 text-warm-50 hover:bg-navy-900 active:scale-[0.98] transition-all text-xs font-bold flex items-center gap-2 shadow-xl border border-navy-800">
            <Plus className="w-4 h-4 text-bronze-400" />
            <span>Add New Campaign</span>
          </button>
        </Link>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-warm-50 p-3 rounded-2xl border border-navy-200/80 shadow-sm">
        {/* Section Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
          {SECTION_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? campaigns.length
                : campaigns.filter((c) => c.section === tab.id).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-navy-950 text-warm-50 shadow-md"
                    : "text-navy-700 hover:bg-warm-200/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isActive ? "bg-bronze-500 text-warm-50" : "bg-navy-200/70 text-navy-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-navy-200 text-xs font-sans text-navy-950 focus:ring-2 focus:ring-bronze-500 outline-none"
          />
        </div>
      </div>

      {/* Campaign Cards Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="p-12 text-center bg-warm-50 rounded-2xl border border-dashed border-navy-200 space-y-4">
          <Layers className="w-10 h-10 text-navy-400 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No campaigns found</h3>
          <p className="text-xs text-navy-600 max-w-sm mx-auto">
            {searchQuery
              ? "No campaigns match your search query."
              : "No campaigns have been added to this section yet. Click below to add your first campaign."}
          </p>
          <Link href="/admin/campaigns/new" className="inline-block">
            <button className="px-4 py-2 rounded-xl bg-navy-950 text-warm-50 text-xs font-bold flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4 text-bronze-400" />
              <span>Create Campaign</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((item) => (
            <div
              key={item.id}
              className="bg-warm-50 rounded-2xl border border-navy-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Media Preview Header */}
              <div className="relative w-full aspect-[16/9] bg-navy-950 overflow-hidden border-b border-navy-200/60">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-navy-500">
                    <Film className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-mono">NO COVER MEDIA</span>
                  </div>
                )}

                {/* Section Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-navy-950/90 text-bronze-400 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-bronze-500/30">
                    {item.section}
                  </span>
                  {item.isFeatured && (
                    <span className="px-2 py-1 rounded-full bg-amber-500 text-warm-50 text-[10px] font-bold">
                      FLAGSHIP
                    </span>
                  )}
                </div>

                {/* Star Toggle Button */}
                <button
                  onClick={() => handleToggleStarred(item)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-navy-950/80 backdrop-blur-md border border-navy-700 text-warm-50 hover:text-amber-400 transition-colors"
                  title="Star / Pin Campaign"
                >
                  <Star className={`w-3.5 h-3.5 ${item.isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>

                {/* Publish Status Badge */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.publishStatus === "published"
                        ? "bg-emerald-500/90 text-white"
                        : item.publishStatus === "archived"
                        ? "bg-red-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {item.publishStatus}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-bronze-600 uppercase font-semibold">
                      {item.category || item.client || "Marketing Campaign"}
                    </span>
                    {item.year && (
                      <span className="text-[10px] font-mono text-navy-400">{item.year}</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-navy-950 line-clamp-1 group-hover:text-bronze-600 transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-navy-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Badges Strip */}
                {Array.isArray(item.badges) && item.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-navy-100">
                    {item.badges.map((b: string) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded bg-navy-100 text-navy-800 text-[10px] font-mono font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Controls */}
                <div className="pt-4 border-t border-navy-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    disabled={isUpdating}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                      item.publishStatus === "published"
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                    }`}
                  >
                    {item.publishStatus === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <div className="flex items-center gap-1">
                    <Link href={`/admin/campaigns/${item.id}/edit`}>
                      <button className="p-2 rounded-lg hover:bg-navy-100 text-navy-700 hover:text-navy-950 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleSoftDelete(item.id)}
                      disabled={isUpdating}
                      className="p-2 rounded-lg hover:bg-red-50 text-navy-400 hover:text-red-600 transition-colors"
                      title="Archive Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
