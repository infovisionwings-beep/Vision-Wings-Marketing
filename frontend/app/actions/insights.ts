"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getInsights() {
  const res = await fetch(`${API_URL}/api/insights`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
}

export async function getInsightBySlug(slug: string) {
  const insights = await getInsights();
  return insights.find((i: any) => i.slug === slug);
}

export async function createInsight(data: any) {
  const user = await requireAdmin();
  
  const res = await fetch(`${API_URL}/api/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error('Failed to create insight');
  
  logAdminAction("insight.create", user.id ?? "unknown", user.email ?? "unknown", { slug: data.slug, title: data.title });
  revalidatePath("/");
  revalidatePath("/admin/insights");
}

export async function updateInsight(id: number, data: any) {
  const user = await requireAdmin();
  
  const res = await fetch(`${API_URL}/api/insights/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error('Failed to update insight');
  
  logAdminAction("insight.update", user.id ?? "unknown", user.email ?? "unknown", { insightId: id });
  revalidatePath("/");
  revalidatePath("/admin/insights");
}

export async function deleteInsight(id: number) {
  const user = await requireAdmin();
  
  const res = await fetch(`${API_URL}/api/insights/${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) throw new Error('Failed to delete insight');
  
  logAdminAction("insight.delete", user.id ?? "unknown", user.email ?? "unknown", { insightId: id });
  revalidatePath("/");
  revalidatePath("/admin/insights");
}
