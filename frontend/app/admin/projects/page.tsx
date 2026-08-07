import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";
import ProjectsAdminTable from "@/components/admin/ProjectsAdminTable";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // The layout's gate is "any resolved admin role", which is no longer enough:
  // the project archive is outside both the SEO and Content Manager remits.
  await requireAdmin(rolesFor("/admin/projects"));

  return <ProjectsAdminTable />;
}
