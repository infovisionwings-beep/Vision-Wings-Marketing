"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus, Pencil, Archive, ArchiveRestore, Trash2, Loader2, AlertCircle,
  RefreshCw, X, ImageIcon, ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import MediaPickerModal from "./MediaPickerModal";
import {
  getAdminClientLogos, createClientLogo, updateClientLogo,
  archiveClientLogo, restoreClientLogo, deleteClientLogo,
} from "@/app/actions/clientLogos";

type StatusFilter = "active" | "archived" | "all";

interface Logo {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl: string | null;
  displayOrder: number;
  publishStatus: string;
}

const emptyDraft = { name: "", logoUrl: "", linkUrl: "", displayOrder: 0 };

/**
 * Client logos for the homepage marquee: add, edit, archive, restore, and
 * permanently delete -- the same lifecycle as photos, videos, and projects.
 * Logo images come from the existing Media Library photo picker, so there is
 * no separate upload path to build here.
 */
export default function ClientLogosAdmin() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = useCallback(async () => {
    const data = await getAdminClientLogos();
    setLogos((data as Logo[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = logos.filter((l) => {
    if (statusFilter === "active") return l.publishStatus !== "archived";
    if (statusFilter === "archived") return l.publishStatus === "archived";
    return true;
  });
  const archivedCount = logos.filter((l) => l.publishStatus === "archived").length;

  const openAdd = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft, displayOrder: logos.length });
    setFormOpen(true);
  };

  const openEdit = (logo: Logo) => {
    setEditingId(logo.id);
    setDraft({
      name: logo.name,
      logoUrl: logo.logoUrl,
      linkUrl: logo.linkUrl || "",
      displayOrder: logo.displayOrder,
    });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = editingId
      ? await updateClientLogo(editingId, draft)
      : await createClientLogo(draft);

    if (res.error) {
      setError(res.error);
    } else {
      setFormOpen(false);
      await load();
    }
    setSaving(false);
  };

  const act = async (id: string, fn: () => Promise<{ error?: string } | void>) => {
    setBusyId(id);
    setError("");
    const res = await fn();
    if (res && "error" in res && res.error) setError(res.error);
    await load();
    setBusyId(null);
  };

  const handleDelete = (logo: Logo) => {
    if (!confirm(`Permanently delete "${logo.name}"?\n\nThis cannot be undone.`)) return;
    return act(logo.id, () => deleteClientLogo(logo.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filter by status"
          className="min-h-[44px] rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-950 outline-none focus:border-bronze-500"
        >
          <option value="active">Active</option>
          <option value="archived">Archived{archivedCount ? ` (${archivedCount})` : ""}</option>
          <option value="all">All</option>
        </select>

        <Button type="button" variant="secondary" onClick={load} className="gap-2 text-xs" aria-label="Refresh">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>

        <Button type="button" variant="primary" onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add logo
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-navy-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-300 bg-warm-50 px-6 py-16 text-center">
          <p className="font-semibold text-navy-950">
            {logos.length === 0 ? "No client logos yet." : "No logos match this filter."}
          </p>
          <p className="mt-1 text-sm text-navy-500">
            {logos.length === 0
              ? "Add your first logo to start the homepage marquee."
              : "Try a different filter."}
          </p>
          {logos.length === 0 && (
            <Button type="button" variant="primary" onClick={openAdd} className="mt-5 gap-2">
              <Plus className="h-4 w-4" />
              Add logo
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((logo) => {
            const archived = logo.publishStatus === "archived";
            const busy = busyId === logo.id;
            return (
              <li
                key={logo.id}
                className={`flex flex-col overflow-hidden rounded-2xl border border-navy-200 bg-white ${archived ? "opacity-60" : ""}`}
              >
                <div className="relative flex aspect-[3/2] items-center justify-center bg-warm-50 p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.logoUrl} alt={logo.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  {archived && (
                    <span className="absolute right-2 top-2 rounded-full bg-navy-950/85 px-2 py-0.5 text-[11px] font-semibold text-warm-50">
                      Archived
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="truncate text-sm font-semibold text-navy-950" title={logo.name}>{logo.name}</p>
                  {logo.linkUrl && (
                    <a
                      href={logo.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 truncate text-xs text-navy-500 outline-none hover:text-bronze-700 focus-visible:ring-2 focus-visible:ring-bronze-500"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="truncate">{logo.linkUrl}</span>
                    </a>
                  )}

                  <div className="mt-auto flex items-center gap-1 border-t border-navy-100 pt-2">
                    <button
                      type="button"
                      onClick={() => openEdit(logo)}
                      disabled={busy}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-navy-50 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                      aria-label={`Edit ${logo.name}`}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {archived ? (
                      <>
                        <button
                          type="button"
                          onClick={() => act(logo.id, () => restoreClientLogo(logo.id))}
                          disabled={busy}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                          aria-label={`Restore ${logo.name}`}
                          title="Restore"
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArchiveRestore className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(logo)}
                          disabled={busy}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                          aria-label={`Delete ${logo.name} permanently`}
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => act(logo.id, () => archiveClientLogo(logo.id))}
                        disabled={busy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-navy-50 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
                        aria-label={`Archive ${logo.name}`}
                        title="Archive"
                      >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md"
          onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setFormOpen(false); }}
        >
          <form
            onSubmit={handleSave}
            className="w-full max-w-md space-y-5 rounded-2xl border border-navy-200 bg-warm-50 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy-950">
                {editingId ? "Edit logo" : "Add logo"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={saving}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-navy-100 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="logo-name" className="text-sm font-medium text-navy-800">Company name</label>
              <input
                id="logo-name"
                type="text"
                required
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-navy-950 outline-none focus:border-bronze-500 focus:ring-2 focus:ring-bronze-500/40"
                placeholder="Acme Corp"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-sm font-medium text-navy-800">Logo</span>
              {draft.logoUrl ? (
                <div className="flex items-center gap-3 rounded-xl border border-navy-200 bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.logoUrl} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-warm-50 object-contain" />
                  <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-navy-500">{draft.logoUrl}</p>
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, logoUrl: "" }))}
                    aria-label="Remove logo"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy-500 outline-none transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-bronze-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-navy-300 bg-white px-4 py-3 text-sm text-navy-500">
                  Nothing selected.
                </p>
              )}
              <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)} className="gap-2 text-xs">
                <ImageIcon className="h-3.5 w-3.5" />
                {draft.logoUrl ? "Replace" : "Choose or upload"}
              </Button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="logo-link" className="text-sm font-medium text-navy-800">
                Website link <span className="font-normal text-navy-400">(optional)</span>
              </label>
              <input
                id="logo-link"
                type="url"
                value={draft.linkUrl}
                onChange={(e) => setDraft((d) => ({ ...d, linkUrl: e.target.value }))}
                className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-navy-950 outline-none focus:border-bronze-500 focus:ring-2 focus:ring-bronze-500/40"
                placeholder="https://acme.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="logo-order" className="text-sm font-medium text-navy-800">Display order</label>
              <input
                id="logo-order"
                type="number"
                value={draft.displayOrder}
                onChange={(e) => setDraft((d) => ({ ...d, displayOrder: parseInt(e.target.value, 10) || 0 }))}
                className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-navy-950 outline-none focus:border-bronze-500 focus:ring-2 focus:ring-bronze-500/40"
              />
              <p className="text-xs text-navy-500">Lower numbers appear first in the marquee.</p>
            </div>

            <div className="flex justify-end gap-2 border-t border-navy-200 pt-4">
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving} className="gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save changes" : "Add logo"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <MediaPickerModal
        kind="photo"
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => setDraft((d) => ({ ...d, logoUrl: url }))}
        title="Choose or upload a logo"
      />
    </div>
  );
}
