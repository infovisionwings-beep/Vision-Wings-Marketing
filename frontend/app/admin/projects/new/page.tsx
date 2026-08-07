import ProjectForm from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";

export default async function NewProjectPage() {
  await requireAdmin(rolesFor("/admin/projects"));
  return (
    <div>
      <h1 className="text-h2 text-navy-950 mb-8">Create New Project</h1>
      <ProjectForm />
    </div>
  );
}
