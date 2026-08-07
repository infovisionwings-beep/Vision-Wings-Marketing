// Reading this as: Executive mission control dashboard chrome for an elite digital branding agency, using dark-mode navigational chrome, live system telemetry indicators, and high-contrast typography.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 5

import { Link } from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { requireAdmin, requireAdminToken } from "@/lib/auth/rbac";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminNavList, AdminLogoutButton } from "@/components/admin/AdminNav";
import { InactivityWarning } from "@/components/admin/InactivityWarning";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  // Every data-bearing admin page reaches the backend with the admin_session
  // cookie as a bearer token. `requireAdmin` alone does not guarantee one: it is
  // satisfied by the primary site session, and the super admin is granted
  // Developer straight from SUPER_ADMIN_EMAIL so it survives cookie expiry. The
  // dashboard therefore rendered perfectly while every backend call returned
  // "Unauthorized" and every list came back empty — the Media Library showed no
  // uploads at all despite the assets existing.
  //
  // Only /admin/logs and /admin/new remembered to mint the token themselves,
  // which is precisely why the other pages broke. Minting it is part of entering
  // the dashboard, not something each new page has to remember. Redirecting is
  // safe here: /admin-login is a sibling route, not nested under this layout.
  await requireAdminToken();
  const initials = (admin.name || admin.email || "VW")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("") || "VW";

  return (
    <div className="min-h-screen bg-warm-100/60 flex text-navy-950 font-sans">
      <InactivityWarning />
      {/* Sidebar */}
      <aside className="w-64 bg-navy-950 text-warm-50 flex flex-col hidden md:flex border-r border-navy-800 relative z-20">

        {/* Brand */}
        <div className="p-6 border-b border-navy-800">
          <Link href="/admin" className="flex items-center gap-3 group outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-bronze-500" data-interactive>
            <img src="/logo-svg/Dark%20BG%20ICON.svg" alt="" className="h-7 w-auto transition-transform group-hover:scale-105" />
            <span className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none tracking-tight text-warm-50">Vision Wings</span>
              <span className="text-[11px] tracking-wide text-navy-300 mt-1">Admin</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <AdminNavList role={admin.role} />
        </div>

        <div className="border-t border-navy-800 p-4">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        
        <header className="bg-warm-50/90 backdrop-blur-md border-b border-navy-200 px-4 md:px-6 py-3 flex justify-between items-center gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <AdminMobileNav role={admin.role} />
            <span className="font-display text-base font-bold text-navy-950 md:hidden">Vision Wings</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-navy-600 transition-colors outline-none hover:bg-warm-200 hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-bronze-500"
              data-interactive
            >
              <span className="hidden sm:inline">View site</span>
              <span className="sm:hidden">Site</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div
              className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-navy-950 text-xs font-bold text-warm-50"
              title={admin.email}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content Surface */}
        <div className="px-4 py-6 sm:p-6 md:p-10 flex-1 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
