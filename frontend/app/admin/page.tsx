// Reading this as: Executive mission control dashboard for an elite digital branding agency, using plain-layout telemetry metrics and an Asymmetric 4-Cell Command Bento Grid.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 5

import { getProjects } from "@/app/actions/projects";
import { getInsights } from "@/app/actions/insights";
import { getAdminCampaigns } from "@/app/actions/campaigns";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { Link } from "@/components/ui/Link";
import { ArrowRight, FileText, Video, Sparkles, Plus, ShieldAlert, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let projects: any[] = [];
  let insights: any[] = [];
  let leads: any[] = [];
  let campaignsCount = 0;
  let dbError = null;

  try {
    const [pData, iData, lData, cData] = await Promise.all([
      getProjects(),
      getInsights(),
      db.select().from(userProfiles),
      getAdminCampaigns()
    ]);
    projects = pData || [];
    insights = iData || [];
    leads = lData || [];
    campaignsCount = (cData || []).filter((c: any) => c.publishStatus === "published").length;
  } catch (e: any) {
    console.error("Dashboard DB Error:", e);
    dbError = e;
  }

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-navy-200 pb-6">
        <h1 className="text-h2 font-bold text-navy-950 tracking-tight">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-navy-950 px-4 text-sm font-semibold text-warm-50 transition-colors outline-none hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500"
            data-interactive
          >
            <Plus className="w-4 h-4 text-bronze-400" />
            New project
          </Link>
          <Link
            href="/admin/insights/new"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-navy-300 bg-warm-200 px-4 text-sm font-semibold text-navy-950 transition-colors outline-none hover:bg-warm-300 focus-visible:ring-2 focus-visible:ring-bronze-500"
            data-interactive
          >
            <FileText className="w-4 h-4 text-bronze-700" />
            New insight
          </Link>
        </div>
      </div>

      {/* Error Alert Box if Neon Connection Timed Out */}
      {dbError && (
        <div role="alert" className="bg-red-950 text-red-100 p-5 rounded-xl border border-red-800 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-red-100">Couldn&rsquo;t reach the database</h2>
            <p className="text-sm text-red-200/90 mt-1 leading-relaxed">
              The counts below may be wrong or show zero. Check your network or VPN, then reload.
            </p>
          </div>
        </div>
      )}

      {/* Counts double as the jump-off into each section, so the numbers do work
          rather than just sit there being large. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-xl border border-navy-200 bg-navy-200 overflow-hidden">
        {[
          { label: "Campaigns", value: campaignsCount, href: "/admin/campaigns", note: "published" },
          { label: "Projects", value: projects.length, href: "/admin/projects", note: "in archive" },
          { label: "Insights", value: insights.length, href: "/admin/insights", note: "published" },
          { label: "Leads", value: leads.length, href: "/admin/leads", note: "total" },
        ].map(({ label, value, href, note }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-1 bg-warm-50 p-4 sm:p-5 transition-colors outline-none hover:bg-warm-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bronze-500"
            data-interactive
          >
            <span className="text-sm font-medium text-navy-600 group-hover:text-navy-950">{label}</span>
            <span className="text-h3 font-bold text-navy-950 tabular-nums leading-none">{value}</span>
            <span className="text-xs text-navy-500">{note}</span>
          </Link>
        ))}
      </div>

      {/* The counts above already reach campaigns, projects, insights and leads.
          These are the remaining destinations, kept quiet — a dashboard should
          point somewhere, not describe the architecture back to its own author. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: "/admin/videos", label: "Videos", desc: "Upload and track transcoding", Icon: Video },
          { href: "/admin/photos", label: "Photos", desc: "Upload and manage images", Icon: Sparkles },
          { href: "/admin/content", label: "Site content", desc: "Edit homepage copy", Icon: Layers },
        ].map(({ href, label, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-navy-200 bg-warm-50 p-4 transition-colors outline-none hover:border-navy-300 hover:bg-warm-100 focus-visible:ring-2 focus-visible:ring-bronze-500"
            data-interactive
          >
            <Icon className="h-5 w-5 shrink-0 text-bronze-600" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-navy-950">{label}</span>
              <span className="block text-sm text-navy-500">{desc}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-navy-400 transition-transform group-hover:translate-x-0.5 group-hover:text-navy-700" />
          </Link>
        ))}
      </div>
    </div>
  );
}
