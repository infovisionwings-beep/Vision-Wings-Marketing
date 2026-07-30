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
import { ArrowRight, Briefcase, FileText, Video, Users, Sparkles, Plus, CheckCircle2, ShieldAlert, Layers } from "lucide-react";

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
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-navy-200/80 pb-8">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-bronze-600 block mb-2">
            MISSION CONTROL / OVERVIEW
          </span>
          <h1 className="text-display sm:text-h1 font-bold text-navy-950 tracking-tight">
            System Telemetry
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projects/new">
            <button className="px-4 py-2.5 rounded-lg bg-navy-950 text-warm-50 hover:bg-navy-900 active:scale-[0.98] transition-all text-xs font-bold flex items-center gap-2 shadow-md">
              <Plus className="w-4 h-4 text-bronze-400" />
              <span>New Commission</span>
            </button>
          </Link>
          <Link href="/admin/insights">
            <button className="px-4 py-2.5 rounded-lg bg-warm-200 text-navy-950 hover:bg-warm-300 active:scale-[0.98] transition-all text-xs font-bold flex items-center gap-2 border border-navy-300/50">
              <FileText className="w-4 h-4 text-bronze-700" />
              <span>Publish Essay</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Error Alert Box if Neon Connection Timed Out */}
      {dbError && (
        <div className="bg-red-950 text-red-100 p-6 rounded-xl border border-red-800 shadow-lg flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-base text-red-200">Neon PostgreSQL Network Latency / Connection Timeout</h3>
            <p className="text-sm text-red-300 mt-1 leading-relaxed">
              Your local development environment timed out connecting to the Neon serverless database. Check your network or VPN settings. The UI fallback state is displayed below.
            </p>
          </div>
        </div>
      )}

      {/* Plain-Layout Live Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-4 border-b border-navy-200/80">
        <div>
          <span className="text-xs font-mono text-navy-500 block mb-1">01 / MARKETING CAMPAIGNS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-display font-bold text-navy-950 tracking-tighter">{campaignsCount}</span>
            <span className="text-xs font-mono text-bronze-600 font-semibold">CMS LIVE</span>
          </div>
        </div>
        <div>
          <span className="text-xs font-mono text-navy-500 block mb-1">02 / PROJECTS ARCHIVE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-display font-bold text-navy-950 tracking-tighter">{projects.length}</span>
            <span className="text-xs font-mono text-navy-700 font-semibold">INDEXED</span>
          </div>
        </div>
        <div>
          <span className="text-xs font-mono text-navy-500 block mb-1">03 / PUBLISHED ESSAYS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-display font-bold text-navy-950 tracking-tighter">{insights.length}</span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">LIVE</span>
          </div>
        </div>
        <div>
          <span className="text-xs font-mono text-navy-500 block mb-1">04 / CLIENT PROSPECTS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-display font-bold text-navy-950 tracking-tighter">{leads.length}</span>
            <span className="text-xs font-mono text-bronze-600 font-semibold">LEADS</span>
          </div>
        </div>
      </div>

      {/* Asymmetric 4-Cell Command Bento Grid */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Cell 1: Projects Command Card (col-span-12 lg:col-span-7) */}
        <div className="col-span-12 lg:col-span-7 bg-navy-950 text-warm-50 rounded-2xl p-8 border border-navy-800 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center text-bronze-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-navy-900 text-bronze-400 font-semibold border border-navy-800">
                PRIMARY ARCHIVE
              </span>
            </div>
            <div>
              <h2 className="text-h3 font-bold text-warm-50 mb-2">Commissions &amp; Flagships</h2>
              <p className="text-body-sm text-navy-300 max-w-lg leading-relaxed">
                Manage your agency portfolio. Featured case studies render on the homepage exhibition gallery with cinematic 16:9 photography.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-navy-800/80 flex items-center justify-between relative z-10">
            <span className="text-xs font-mono text-navy-400">{projects.length} Commissions Indexed</span>
            <Link 
              href="/admin/projects" 
              className="text-xs font-bold font-mono text-warm-50 hover:text-bronze-400 flex items-center gap-2 group-hover:translate-x-1 transition-all"
            >
              <span>OPEN ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cell 2: Editorial Insights Tile (col-span-12 lg:col-span-5) */}
        <div className="col-span-12 lg:col-span-5 bg-warm-50 text-navy-950 rounded-2xl p-8 border border-navy-200/80 shadow-md flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-warm-200/80 border border-navy-300/40 flex items-center justify-center text-navy-900">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-warm-200 text-navy-700 font-semibold">
                EDITORIAL WIRE
              </span>
            </div>
            <div>
              <h2 className="text-h3 font-bold text-navy-950 mb-2">Thinking &amp; Essays</h2>
              <p className="text-body-sm text-navy-600 leading-relaxed">
                Publish high-contrast strategic essays. Long-form articles render on the homepage minimalist newspaper wire with automatic reading-time calculation.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-navy-200 flex items-center justify-between">
            <span className="text-xs font-mono text-navy-500">{insights.length} Published Essays</span>
            <Link 
              href="/admin/insights" 
              className="text-xs font-bold font-mono text-navy-950 hover:text-bronze-700 flex items-center gap-2 group-hover:translate-x-1 transition-all"
            >
              <span>MANAGE ESSAYS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cell 3: Cloud Video Transcoding Engine (col-span-12 lg:col-span-6) */}
        <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-navy-900 to-navy-950 text-warm-100 rounded-2xl p-8 border border-navy-800 shadow-md flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-emerald-400">
                <Video className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>UPSTASH REDIS + BULLMQ</span>
              </div>
            </div>
            <div>
              <h2 className="text-h3 font-bold text-warm-50 mb-2">Dual Transcoding Pipeline</h2>
              <p className="text-body-sm text-navy-300 leading-relaxed">
                Zero local storage footprint. Uploaded media is automatically queued and transcoded into WebM (VP9) and MP4 (H.264) via Vercel Blob and serverless workers.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-navy-800 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400">100% Cloud CDN Active</span>
            <Link 
              href="/admin/videos" 
              className="text-xs font-bold font-mono text-warm-50 hover:text-emerald-400 flex items-center gap-2 group-hover:translate-x-1 transition-all"
            >
              <span>OPEN PIPELINE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cell 4: Client Leads & Onboarding Intel (col-span-12 lg:col-span-6) */}
        <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-warm-100 to-warm-200/90 text-navy-950 rounded-2xl p-8 border border-bronze-500/20 shadow-md flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-warm-50 border border-navy-200 flex items-center justify-center text-bronze-700">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-bronze-500/10 border border-bronze-500/30 text-bronze-800 font-semibold">
                PROSPECT INTEL
              </span>
            </div>
            <div>
              <h2 className="text-h3 font-bold text-navy-950 mb-2">Onboarding Profiles</h2>
              <p className="text-body-sm text-navy-700 leading-relaxed">
                View detailed onboarding dossiers from new executive signups, including company size, contact credentials, and strategic interest vectors.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-navy-300/40 flex items-center justify-between">
            <span className="text-xs font-mono text-navy-700">{leads.length} Dossiers Logged</span>
            <Link 
              href="/admin/leads" 
              className="text-xs font-bold font-mono text-navy-950 hover:text-bronze-800 flex items-center gap-2 group-hover:translate-x-1 transition-all"
            >
              <span>VIEW LEADS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
