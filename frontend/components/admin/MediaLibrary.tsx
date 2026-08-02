"use client";

import { useState } from "react";
import { Image as ImageIcon, Film } from "lucide-react";
import MediaAssetGrid from "./MediaAssetGrid";

type Tab = "photos" | "videos";

/**
 * Photos and videos under one roof. They were two separate nav entries, each
 * showing the full transcoding pipeline console — which read as two systems to
 * learn rather than one place where the site's media lives. The pipeline is a
 * tool, so it is now a status chip on each asset rather than the screen itself.
 */
export default function MediaLibrary() {
  const [tab, setTab] = useState<Tab>("photos");

  const tabs: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
    { id: "photos", label: "Photos", icon: ImageIcon },
    { id: "videos", label: "Videos", icon: Film },
  ];

  return (
    <div className="space-y-8">
      <div role="tablist" aria-label="Media type" className="flex gap-1 border-b border-navy-200">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              id={`media-tab-${id}`}
              aria-selected={active}
              aria-controls={`media-panel-${id}`}
              onClick={() => setTab(id)}
              className={`-mb-px flex min-h-[44px] items-center gap-2 border-b-2 px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-bronze-500 ${
                active
                  ? "border-bronze-600 text-navy-950"
                  : "border-transparent text-navy-500 hover:text-navy-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Only the active grid is mounted: each one polls while its assets are
          converting, and keeping both alive doubled that for no benefit. */}
      <div role="tabpanel" id={`media-panel-${tab}`} aria-labelledby={`media-tab-${tab}`}>
        <MediaAssetGrid kind={tab} />
      </div>
    </div>
  );
}
