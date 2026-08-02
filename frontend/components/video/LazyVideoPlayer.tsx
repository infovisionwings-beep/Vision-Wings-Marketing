"use client";

import React, { useState, useRef } from "react";
import { Play, Film } from "lucide-react";

interface LazyVideoPlayerProps {
  webmUrl?: string | null;
  mp4Url?: string | null;
  posterUrl?: string | null;
  title?: string;
  className?: string;
}

export const LazyVideoPlayer: React.FC<LazyVideoPlayerProps> = ({
  webmUrl,
  mp4Url,
  posterUrl,
  title,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-navy-950 shadow-lg group border border-navy-800 ${className}`}>
      {!isPlaying ? (
        <div 
          onClick={handlePlayClick}
          className="relative w-full aspect-video bg-navy-900 cursor-pointer flex items-center justify-center group/poster overflow-hidden"
        >
          {/* Poster Image */}
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title || "Video thumbnail"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-navy-400">
              <Film className="w-12 h-12 stroke-[1.5]" />
              <span className="text-sm font-medium">Click to Play Video</span>
            </div>
          )}

          {/* Dark gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60 group-hover/poster:opacity-80 transition-opacity" />

          {/* Glowing Play Button */}
          <div className="absolute z-10 w-16 h-16 rounded-full bg-bronze-500/90 text-navy-950 flex items-center justify-center shadow-2xl backdrop-blur-sm group-hover/poster:scale-110 group-hover/poster:bg-bronze-400 transition-all duration-300">
            <Play className="w-7 h-7 fill-navy-950 ml-1" />
          </div>

          {/* Format indicator badge */}
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-navy-950/80 text-warm-50 text-xs font-semibold backdrop-blur-md border border-navy-700/50">
            {webmUrl ? "WEBM / MP4" : "MP4"}
          </div>

          {title && (
            <div className="absolute bottom-3 left-3 right-3 z-10 text-warm-50 font-medium text-sm truncate">
              {title}
            </div>
          )}
        </div>
      ) : (
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          preload="auto"
          poster={posterUrl || undefined}
          className="w-full aspect-video object-cover"
        >
          {webmUrl && <source src={webmUrl} type="video/webm" />}
          {mp4Url && <source src={mp4Url} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};
