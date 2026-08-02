"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus, ArrowUpRight, Briefcase, Sparkles, Archive, ArchiveRestore,
  Trash2, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { Link } from "@/components/ui/Link";
import Button from "@/components/ui/Button";
import {
  getAdminProjects, archiveProject, restoreProject, deleteProject,
} from "@/app/actions/projects";

type StatusFilter = "active" | "archived" | "all";

/**
 * The list page for Projects, now with the archive -> delete lifecycle every
 * other content type already has. `deleteProject` existed in code before this
 * but nothing in the UI ever called it, and there was no archive step at all --
 * the only way to remove a project was a direct, unconfirmed hard delete, which
 * is presumably why the button was never wired up in the first place.
 */
export default function ProjectsAdminTable() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const data = await getAdminProjects();
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = projects.filter((p) => {
    if (statusFilter === "active") return p.publishStatus !== "archived";
    if (statusFilter === "archived") return p.publishStatus === "archived";
    return true;
  });

  const archivedCount = projects.filter((p) => p.publishStatus === "archived").length;

  const act = async (id: number, fn: () => Promise<{ error?: string } | void>) => {
    setBusyId(id);
    setError("");
    const res = await fn();
    if (res && "error" in res && res.error) setError(res.error);
    await load();
    setBusyId(null);
  };

  const handleDelete = (project: any) => {
    if (!confirm(`Permanently delete "${project.title}"?\n\nThis cannot be undone.`)) return;
    return act(project.id, () => deleteProject(project.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-200/80 pb-6">
        <h1 className="text-h2 font-bold text-navy-950 tracking-tight">Projects</h1>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Filter by status"
            className="min-h-[44px] rounded-lg border border-navy-200 bg-white px-3 text-sm text-navy-950 outline-none focus:border-bronze-500"
          >
            <option value="active">Active</option>
            <option value="archived">Archived{archivedCount ? ` (${archivedCount})` : ""}</option>
            <option value="all">All</option>
          </select>
          <Button type="button" variant="secondary" onClick={load} className="gap-2 text-xs" aria-label="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Link href="/admin/projects/new">
            <button className="flex min-h-[44px] items-center gap-2 rounded-lg bg-navy-950 px-4 text-sm font-semibold text-warm-50 transition-colors outline-none hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500">
              <Plus className="w-4 h-4 text-bronze-400" />
              <span>New project</span>
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-warm-50 rounded-2xl shadow-xl border border-navy-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-950 text-warm-50 text-[11px] font-mono font-semibold uppercase tracking-wider border-b border-navy-800">
                <th className="py-4 px-6 w-12">#</th>
                <th className="py-4 px-6">Commission Title</th>
                <th className="py-4 px-6">Discipline Category</th>
                <th className="py-4 px-6">Year</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-200/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-navy-400">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-navy-400 font-mono text-xs">
                    {projects.length === 0
                      ? 'No commissions indexed in archive yet. Click "NEW PROJECT" above to initialize.'
                      : "No projects match this filter."}
                  </td>
                </tr>
              ) : (
                visible.map((project, idx) => {
                  const archived = project.publishStatus === "archived";
                  const busy = busyId === project.id;
                  return (
                    <tr key={project.id || idx} className={`hover:bg-warm-100/70 transition-colors group ${archived ? "opacity-60" : ""}`}>
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
                        {archived ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-navy-100 text-navy-600 font-mono text-[11px]">
                            ARCHIVED
                          </span>
                        ) : project.isFeatured ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950 text-warm-50 font-mono text-[11px] font-semibold border border-navy-800 shadow-sm">
                            <Sparkles className="w-3 h-3 text-bronze-400" />
                            <span>FEATURED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-navy-100 text-navy-700 font-mono text-[11px]">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-warm-200/80 hover:bg-navy-950 hover:text-warm-50 text-navy-900 font-mono text-xs font-bold transition-all active:scale-[0.98]"
                          >
                            <span>EDIT</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>

                          {archived ? (
                            <>
                              <button
                                type="button"
                                onClick={() => act(project.id, () => restoreProject(project.id))}
                                disabled={busy}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                                aria-label={`Restore ${project.title}`}
                                title="Restore"
                              >
                                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArchiveRestore className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(project)}
                                disabled={busy}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                                aria-label={`Delete ${project.title} permanently`}
                                title="Delete permanently"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => act(project.id, () => archiveProject(project.id))}
                              disabled={busy}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-navy-100 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                              aria-label={`Archive ${project.title}`}
                              title="Archive"
                            >
                              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
