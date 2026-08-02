"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard, Layers, Briefcase, FileText, PenSquare,
  Video, Image as ImageIcon, Users, LogOut, Loader2, Building2,
} from "lucide-react";
import { Link } from "@/components/ui/Link";
import { logoutAdmin } from "@/app/actions/adminAuth";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** One source of truth for both the desktop sidebar and the mobile drawer.
 *  They had drifted apart — the drawer was missing Site Content, and neither
 *  could reach the dashboard except through the wordmark. */
export const ADMIN_NAV: { heading: string; items: AdminNavItem[] }[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/campaigns", label: "Campaigns", icon: Layers },
      { href: "/admin/projects", label: "Projects", icon: Briefcase },
      { href: "/admin/insights", label: "Insights", icon: PenSquare },
      { href: "/admin/logos", label: "Client Logos", icon: Building2 },
      { href: "/admin/content", label: "Site Content", icon: FileText },
    ],
  },
  {
    // One entry, not the two pipeline pages. Media is put on the site from Site
    // Content, where each slot has a picker; this is where the library lives.
    heading: "Media",
    items: [{ href: "/admin/media", label: "Media Library", icon: ImageIcon }],
  },
  {
    heading: "People",
    items: [{ href: "/admin/leads", label: "Leads", icon: Users }],
  },
];

export function isActiveRoute(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Nav list shared by both surfaces. `onNavigate` lets the drawer close itself. */
export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6" aria-label="Admin">
      {ADMIN_NAV.map((group) => (
        <div key={group.heading} className="space-y-1">
          <h2 className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-navy-400">
            {group.heading}
          </h2>
          {group.items.map(({ href, label, icon: Icon }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-bronze-500 ${
                  active
                    ? "bg-navy-900 font-semibold text-warm-50"
                    : "font-medium text-navy-200 hover:bg-navy-900/70 hover:text-warm-50"
                }`}
                data-interactive
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-bronze-500"
                  />
                )}
                <Icon className={active ? "h-4 w-4 text-bronze-400" : "h-4 w-4 text-navy-300"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => { logoutAdmin(); })}
      disabled={isPending}
      className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-navy-300 transition-colors outline-none hover:bg-navy-900 hover:text-warm-50 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-60"
      data-interactive
    >
      {isPending
        ? <Loader2 className="h-4 w-4 animate-spin text-bronze-400" />
        : <LogOut className="h-4 w-4" />}
      <span>{isPending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
