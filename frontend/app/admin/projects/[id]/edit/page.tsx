import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(rolesFor("/admin/projects"));
  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    return notFound();
  }

  try {
    const list = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    const project = list[0];

    if (!project) {
      return notFound();
    }

    return (
      <div>
        <h1 className="text-h2 text-navy-950 mb-8">Edit Project</h1>
        <ProjectForm project={project} />
      </div>
    );
  } catch (err) {
    console.error("Failed to fetch project for editing:", err);
    return notFound();
  }
}
