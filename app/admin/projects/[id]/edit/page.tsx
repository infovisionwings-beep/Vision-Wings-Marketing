import ProjectForm from "@/components/admin/ProjectForm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return notFound();
  }

  const result = await db.select().from(projects).where(eq(projects.id, projectId));
  const project = result[0];

  if (!project) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-h2 text-navy-950 mb-8">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
