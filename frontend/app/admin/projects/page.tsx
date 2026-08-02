// Reading this as: Executive projects archive for a strategic branding agency, formatted as a High-Contrast Editorial Table with monospace chrome and tactile action states.
// DESIGN_VARIANCE: 7
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 6

import { getProjects } from "@/app/actions/projects";
import { Link } from "@/components/ui/Link";
import { Plus, ArrowUpRight, ShieldAlert, Briefcase, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: any[] = [];
  let dbError = null;
  
  try {
    projects = await getProjects() || [];
  } catch (e: any) {
    console.error("DB Error on Projects page:", e);
    dbError = e;
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-200/80 pb-6">
        <h1 className="text-h2 font-bold text-navy-950 tracking-tight">Projects</h1>
        <Link href="/admin/projects/new">
          <button className="flex min-h-[44px] items-center gap-2 rounded-lg bg-navy-950 px-4 text-sm font-semibold text-warm-50 transition-colors outline-none hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500">
            <Plus className="w-4 h-4 text-bronze-400" />
            <span>New project</span>
          </button>
        </Link>
      </div>
      
      {/* Network / DB Timeout Alert */}
      {dbError && (
        <div className="bg-red-950 text-red-100 p-6 rounded-xl border border-red-800 shadow-lg flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-base text-red-200">Neon PostgreSQL Network Latency / Connection Timeout</h3>
            <p className="text-sm text-red-300 mt-1 leading-relaxed">
              Your local network timed out while connecting to Neon serverless PostgreSQL. The fallback archive is displayed below.
            </p>
            <pre className="mt-3 text-xs overflow-auto bg-navy-950 p-3 rounded-lg border border-red-900/60 font-mono text-red-300">
              {dbError.message}
            </pre>
          </div>
        </div>
      )}

      {/* High-Contrast Editorial Table */}
      <div className="bg-warm-50 rounded-2xl shadow-xl border border-navy-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-950 text-warm-50 text-[11px] font-mono font-semibold uppercase tracking-wider border-b border-navy-800">
                <th className="py-4 px-6 w-12">#</th>
                <th className="py-4 px-6">Commission Title</th>
                <th className="py-4 px-6">Discipline Category</th>
                <th className="py-4 px-6">Year</th>
                <th className="py-4 px-6">Exhibition Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-200/60 text-sm">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-navy-400 font-mono text-xs">
                    No commissions indexed in archive yet. Click &ldquo;NEW COMMISSION&rdquo; above to initialize.
                  </td>
                </tr>
              ) : (
                projects.map((project, idx) => (
                  <tr key={project.id || idx} className="hover:bg-warm-100/70 transition-colors group">
                    <td className="py-4 px-6 font-mono text-xs text-navy-400 font-semibold">
                      0{idx + 1}
                    </td>
                    <td className="py-4 px-6 font-bold text-navy-950 group-hover:text-bronze-700 transition-colors">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-bronze-600 hidden group-hover:inline-block transition-all" />
                        <span>{project.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-navy-600">
                      {project.category}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-navy-600 font-medium">
                      {project.year || "2024"}
                    </td>
                    <td className="py-4 px-6">
                      {project.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950 text-warm-50 font-mono text-[11px] font-semibold border border-navy-800 shadow-sm">
                          <Sparkles className="w-3 h-3 text-bronze-400" />
                          <span>FEATURED EXHIBIT</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-navy-100 text-navy-700 font-mono text-[11px]">
                          STANDARD ARCHIVE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/admin/projects/${project.id}/edit`} 
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-warm-200/80 hover:bg-navy-950 hover:text-warm-50 text-navy-900 font-mono text-xs font-bold transition-all active:scale-[0.98]"
                      >
                        <span>EDIT</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
