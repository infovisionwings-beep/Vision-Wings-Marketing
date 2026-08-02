"use client";

import { useState } from "react";
import { Image as ImageIcon, Film } from "lucide-react";
import { AdminPhotoManager } from "./AdminPhotoManager";
import { AdminVideoManager } from "./AdminVideoManager";

type Tab = "photos" | "videos";

/**
 * Photos and videos under one roof. They were two separate nav entries, each
 * showing the full transcoding pipeline console — which read as two systems to
 * learn rather than one place where the site's media lives.
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

      {/* Both stay mounted: each manager polls its own list, and remounting on
          every tab switch threw away that state and re-fetched from cold. */}
      <div
        role="tabpanel"
        id="media-panel-photos"
        aria-labelledby="media-tab-photos"
        hidden={tab !== "photos"}
      >
        <AdminPhotoManager />
      </div>
      <div
        role="tabpanel"
        id="media-panel-videos"
        aria-labelledby="media-tab-videos"
        hidden={tab !== "videos"}
      >
        <AdminVideoManager />
      </div>
    </div>
  );
}
