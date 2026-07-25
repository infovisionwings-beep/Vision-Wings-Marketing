import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return notFound();
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${API_URL}/api/projects`, { cache: 'no-store' });
  if (!res.ok) {
    return notFound();
  }
  
  const projects = await res.json();
  const project = projects.find((p: any) => p.id === projectId);

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
