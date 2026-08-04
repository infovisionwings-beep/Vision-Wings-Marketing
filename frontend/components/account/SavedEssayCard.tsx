"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, BookmarkX } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { removeSavedEssay, type SavedEssay } from "@/app/actions/savedEssays";

export default function SavedEssayCard({ essay }: { essay: SavedEssay }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  const remove = () => {
    // Hidden immediately rather than after the round trip: the row is the
    // reader's own and the only failure mode is it coming back on refresh.
    setRemoved(true);
    startTransition(async () => {
      const res = await removeSavedEssay(essay.insightId);
      if (!res.ok) setRemoved(false);
      else router.refresh();
    });
  };

  if (removed) return null;

  return (
    <li className="group relative flex gap-4 sm:gap-5 border-b border-navy-200/80 py-5 first:pt-0">
      <Link
        href={`/insights/${essay.slug}`}
        className="relative block h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-navy-200/70 bg-navy-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-500 sm:h-24 sm:w-36"
        data-interactive
        tabIndex={-1}
        aria-hidden="true"
      >
        {essay.coverImage ? (
          <img
            src={essay.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-h3 font-bold tracking-tighter text-warm-50/15 select-none">
            VW
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <div className="flex items-baseline gap-3 text-[11px] font-mono uppercase tracking-widest">
          <span className="truncate font-semibold text-bronze-700">{essay.category}</span>
          <span className="flex-shrink-0 text-navy-500">{essay.readMinutes} min</span>
        </div>

        <h3 className="text-body font-bold leading-snug text-navy-950 sm:text-body-lg">
          <Link
            href={`/insights/${essay.slug}`}
            className="outline-none transition-colors hover:text-bronze-700 focus-visible:ring-2 focus-visible:ring-bronze-500 focus-visible:ring-offset-2 rounded-sm"
            data-interactive
          >
            {essay.title}
          </Link>
        </h3>

        {essay.authorName && (
          <p className="truncate text-body-sm text-navy-600">{essay.authorName}</p>
        )}
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        title="Remove from library"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center self-center rounded-lg text-navy-400 outline-none transition-colors hover:bg-navy-100 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-50"
        data-interactive
      >
        <BookmarkX className="h-4 w-4" />
        <span className="sr-only">Remove &ldquo;{essay.title}&rdquo; from your library</span>
      </button>
    </li>
  );
}

export function EmptyLibrary() {
  return (
    <div className="rounded-2xl border border-dashed border-navy-300 bg-warm-100/50 px-6 py-14 text-center">
      <BookOpen className="mx-auto h-6 w-6 text-navy-400" />
      <h3 className="mt-4 text-h3 font-bold text-navy-950">Nothing saved yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-body-sm leading-relaxed text-navy-600">
        Use <span className="font-semibold text-navy-900">Save</span> at the end of any essay and it
        will wait for you here.
      </p>
      <Link
        href="/insights"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-navy-950 px-6 text-sm font-semibold text-warm-50 outline-none transition-colors hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 focus-visible:ring-offset-2"
        data-interactive
      >
        Browse essays
      </Link>
    </div>
  );
}
