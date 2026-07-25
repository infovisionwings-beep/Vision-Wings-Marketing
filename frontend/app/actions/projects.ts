"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/rbac";
import { logAdminAction } from "@/lib/auth/audit-log";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return [];
  }
}


export async function getProjectBySlug(slug: string) {
  // We can fetch all and filter or add an endpoint for slug
  const projects = await getProjects();
  return projects.find((p: any) => p.slug === slug);
}

export async function createProject(data: any) {
  const user = await requireAdmin();
  
  const res = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error('Failed to create project');
  
  logAdminAction("project.create", user.id ?? "unknown", user.email ?? "unknown", { slug: data.slug, title: data.title });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: number, data: any) {
  const user = await requireAdmin();
  
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error('Failed to update project');
  
  logAdminAction("project.update", user.id ?? "unknown", user.email ?? "unknown", { projectId: id });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: number) {
  const user = await requireAdmin();
  
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) throw new Error('Failed to delete project');
  
  logAdminAction("project.delete", user.id ?? "unknown", user.email ?? "unknown", { projectId: id });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
