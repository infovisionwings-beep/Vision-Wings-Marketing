"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import Button from "@/components/ui/Button";
import { ArrowLeft, Image as ImageIcon, Film, Sparkles, Loader2, Plus, X, Globe, Eye, Layers } from "lucide-react";
import { AdminPhotoManager } from "./AdminPhotoManager";
import { AdminVideoManager } from "./AdminVideoManager";

interface CampaignFormProps {
  campaign?: any;
  defaultSection?: string;
}

export default function CampaignForm({ campaign, defaultSection = "showcases" }: CampaignFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState(campaign?.section || defaultSection);
  const [title, setTitle] = useState(campaign?.title || "");
  const [slug, setSlug] = useState(campaign?.slug || "");
  const [coverImageUrl, setCoverImageUrl] = useState(campaign?.coverImage || "");
  const [videoUrl, setVideoUrl] = useState(campaign?.videoUrl || "");
  const [posterImageUrl, setPosterImageUrl] = useState(campaign?.posterImage || "");
  const [badges, setBadges] = useState<string[]>(
    Array.isArray(campaign?.badges) ? campaign.badges : ["4K", "HLS"]
  );
  const [badgeInput, setBadgeInput] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<"cover" | "poster">("cover");
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Auto-generate slug from title if new
  useEffect(() => {
    if (!campaign && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [title, campaign]);

  useEffect(() => {
    if (showPhotoModal || showVideoModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [showPhotoModal, showVideoModal]);

  const addBadge = () => {
    if (badgeInput.trim() && !badges.includes(badgeInput.trim())) {
      setBadges([...badges, badgeInput.trim()]);
      setBadgeInput("");
    }
  };

  const removeBadge = (b: string) => {
    setBadges(badges.filter((item) => item !== b));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        section,
        subtitle: (formData.get("subtitle") as string) || "",
        description: (formData.get("description") as string) || "",
        client: (formData.get("client") as string) || "",
        category: (formData.get("category") as string) || "",
        year: (formData.get("year") as string) || "2025",
        duration: (formData.get("duration") as string) || "",
        quoteText: (formData.get("quoteText") as string) || "",
        coverImage: coverImageUrl,
        videoUrl: videoUrl,
        posterImage: posterImageUrl,
        badges,
        primaryCtaText: (formData.get("primaryCtaText") as string) || "",
        primaryCtaLink: (formData.get("primaryCtaLink") as string) || "",
        secondaryCtaText: (formData.get("secondaryCtaText") as string) || "",
        secondaryCtaLink: (formData.get("secondaryCtaLink") as string) || "",
        seoTitle: (formData.get("seoTitle") as string) || "",
        seoDescription: (formData.get("seoDescription") as string) || "",
        publishStatus: (formData.get("publishStatus") as string) || "published",
        isFeatured: formData.get("isFeatured") === "on",
        isStarred: formData.get("isStarred") === "on",
        displayOrder: parseInt((formData.get("displayOrder") as string) || "0", 10),
      };

      if (campaign?.id) {
        await updateCampaign(campaign.id, data);
      } else {
        await createCampaign(data);
      }

      router.push("/admin/campaigns");
      router.refresh();
    } catch (error) {
      console.error("Failed to save campaign:", error);
      alert("Failed to save campaign. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-navy-600 hover:text-navy-950 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO CAMPAIGNS</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 bg-warm-50 p-8 md:p-10 rounded-2xl border border-navy-200/80 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy-950 via-bronze-500 to-navy-900" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-200/80 pb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-bronze-600 font-semibold block mb-1">
              {campaign ? "EDIT MARKETING CAMPAIGN" : "INITIALIZE NEW CAMPAIGN"}
            </span>
            <h2 className="text-2xl font-bold text-navy-950">
              {campaign ? `Editing "${campaign.title}"` : "Campaign Dossier"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-navy-600">SECTION:</span>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-navy-950 text-warm-50 font-mono text-xs font-bold border border-navy-800 focus:ring-2 focus:ring-bronze-500 outline-none"
            >
              <option value="hero">Hero Featured Campaign</option>
              <option value="samples">Samples Grid</option>
              <option value="showcases">Campaign Showcase (01, 02, 03)</option>
              <option value="archive">Campaign Archive</option>
            </select>
          </div>
        </div>

        {/* Section 1: Core Information */}
        <div className="space-y-6">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-navy-500 border-b border-navy-200/60 pb-2">
            01 // Core Identification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lumina Health Rebranding & Commercial"
                className="p-3.5 rounded-xl border border-navy-200 bg-white text-navy-950 font-sans text-sm focus:ring-2 focus:ring-bronze-500 outline-none shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="lumina-health-rebrand"
                className="p-3.5 rounded-xl border border-navy-200 bg-white font-mono text-xs text-navy-950 focus:ring-2 focus:ring-bronze-500 outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={campaign?.subtitle || ""}
                placeholder="e.g. Omnichannel Launch Campaign"
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Client Name</label>
              <input
                type="text"
                name="client"
                defaultValue={campaign?.client || ""}
                placeholder="e.g. Lumina Systems"
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={campaign?.category || ""}
                placeholder="Brand Growth & Ads"
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Year</label>
              <input
                type="text"
                name="year"
                defaultValue={campaign?.year || "2025"}
                placeholder="2025"
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Duration</label>
              <input
                type="text"
                name="duration"
                defaultValue={campaign?.duration || ""}
                placeholder="03:45"
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold uppercase text-navy-950">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={campaign?.description || ""}
              placeholder="High-converting commercial campaign and launch film engineered for rapid market penetration..."
              className="p-3.5 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none leading-relaxed"
            />
          </div>

          {section === "archive" && (
            <div className="flex flex-col gap-2 bg-warm-100/80 p-4 rounded-xl border border-navy-200">
              <label className="text-xs font-mono font-bold uppercase text-bronze-600">
                Quote Text (For Archive Quote Cards)
              </label>
              <textarea
                name="quoteText"
                rows={2}
                defaultValue={campaign?.quoteText || ""}
                placeholder='e.g. "Vision Wings transformed our market presence. They gave our product vision wings to scale 400% YoY."'
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Section 2: Media Attachments */}
        <div className="space-y-6">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-navy-500 border-b border-navy-200/60 pb-2">
            02 // Media &amp; Assets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 p-3 rounded-xl border border-navy-200 bg-white text-xs font-mono text-navy-950 focus:ring-2 focus:ring-bronze-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoTarget("cover");
                    setShowPhotoModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-navy-950 text-warm-50 hover:bg-navy-900 transition-colors text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-bronze-400" />
                  <span>Browse</span>
                </button>
              </div>
              {coverImageUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-navy-200 bg-navy-900">
                  <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Video Asset */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Hero Video URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 p-3 rounded-xl border border-navy-200 bg-white text-xs font-mono text-navy-950 focus:ring-2 focus:ring-bronze-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-navy-950 text-warm-50 hover:bg-navy-900 transition-colors text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Film className="w-3.5 h-3.5 text-bronze-400" />
                  <span>Browse</span>
                </button>
              </div>
              {videoUrl && (
                <div className="p-3 rounded-xl bg-navy-950 text-warm-50 text-xs font-mono flex items-center justify-between border border-navy-800">
                  <span className="truncate max-w-[250px] text-bronze-400">{videoUrl}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">VIDEO LINKED</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Badges & CTAs */}
        <div className="space-y-6">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-navy-500 border-b border-navy-200/60 pb-2">
            03 // Badges &amp; Call-to-Actions
          </h3>

          {/* Badges */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold uppercase text-navy-950">Badges (e.g. 4K, HLS, HDR)</label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full bg-navy-950 text-warm-50 text-xs font-mono font-bold flex items-center gap-1.5 border border-navy-800"
                >
                  <span>{b}</span>
                  <button type="button" onClick={() => removeBadge(b)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBadge();
                  }
                }}
                placeholder="Add badge (e.g. Lossless 4K)"
                className="p-2.5 rounded-xl border border-navy-200 bg-white text-xs font-mono text-navy-950 outline-none"
              />
              <button
                type="button"
                onClick={addBadge}
                className="px-4 py-2.5 rounded-xl bg-warm-200 text-navy-950 text-xs font-mono font-bold hover:bg-warm-300 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* CTAs (Visible primarily when section is 'hero') */}
          {section === "hero" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-navy-950 text-warm-50 p-6 rounded-2xl border border-navy-800">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-bronze-400 uppercase">Primary CTA</span>
                <input
                  type="text"
                  name="primaryCtaText"
                  defaultValue={campaign?.primaryCtaText || "Launch Your Campaign"}
                  placeholder="Button Text"
                  className="w-full p-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-warm-50 outline-none"
                />
                <input
                  type="text"
                  name="primaryCtaLink"
                  defaultValue={campaign?.primaryCtaLink || "/contact"}
                  placeholder="URL Target (/contact)"
                  className="w-full p-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs font-mono text-warm-50 outline-none"
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-bronze-400 uppercase">Secondary CTA</span>
                <input
                  type="text"
                  name="secondaryCtaText"
                  defaultValue={campaign?.secondaryCtaText || "Explore Marketing Services"}
                  placeholder="Button Text"
                  className="w-full p-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-warm-50 outline-none"
                />
                <input
                  type="text"
                  name="secondaryCtaLink"
                  defaultValue={campaign?.secondaryCtaLink || "#strategy"}
                  placeholder="URL Target (#strategy)"
                  className="w-full p-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs font-mono text-warm-50 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Publishing & Controls */}
        <div className="space-y-6">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-navy-500 border-b border-navy-200/60 pb-2">
            04 // Publishing &amp; Telemetry Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Publish Status</label>
              <select
                name="publishStatus"
                defaultValue={campaign?.publishStatus || "published"}
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 font-mono text-xs font-bold focus:ring-2 focus:ring-bronze-500 outline-none"
              >
                <option value="published">LIVE / PUBLISHED</option>
                <option value="draft">DRAFT (Hidden from website)</option>
                <option value="archived">ARCHIVED (Soft Deleted)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold uppercase text-navy-950">Display Order</label>
              <input
                type="number"
                name="displayOrder"
                defaultValue={campaign?.displayOrder ?? 0}
                className="p-3 rounded-xl border border-navy-200 bg-white text-navy-950 text-sm font-mono focus:ring-2 focus:ring-bronze-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={campaign?.isFeatured ?? false}
                  className="w-4 h-4 rounded text-bronze-500 focus:ring-bronze-500"
                />
                <span className="text-xs font-mono font-bold text-navy-950 uppercase">Featured Flagship</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isStarred"
                  defaultChecked={campaign?.isStarred ?? false}
                  className="w-4 h-4 rounded text-bronze-500 focus:ring-bronze-500"
                />
                <span className="text-xs font-mono font-bold text-navy-950 uppercase">Pin / Starred</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-navy-200/80">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="px-8 shadow-xl flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-warm-50" />
                <span>Committing Dossier...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-bronze-400" />
                <span>{campaign ? "Update Campaign" : "Publish Campaign"}</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Photo Picker Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
          <div className="bg-warm-50 w-full max-w-5xl h-[85vh] rounded-2xl border border-navy-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-navy-950 text-warm-50 flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-bronze-400" />
                <span className="text-xs font-mono font-bold uppercase">SELECT IMAGE FROM MEDIA LIBRARY</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="p-1 rounded hover:bg-navy-800 text-navy-400 hover:text-warm-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <AdminPhotoManager
                isModal={true}
                onSelectPhoto={(photoUrl: string) => {
                  if (photoTarget === "cover") setCoverImageUrl(photoUrl);
                  else setPosterImageUrl(photoUrl);
                  setShowPhotoModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Picker Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
          <div className="bg-warm-50 w-full max-w-5xl h-[85vh] rounded-2xl border border-navy-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-navy-950 text-warm-50 flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-bronze-400" />
                <span className="text-xs font-mono font-bold uppercase">SELECT VIDEO FROM MEDIA LIBRARY</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded hover:bg-navy-800 text-navy-400 hover:text-warm-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <AdminVideoManager
                isModal={true}
                onSelectVideo={(vUrl: string) => {
                  setVideoUrl(vUrl);
                  setShowVideoModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
