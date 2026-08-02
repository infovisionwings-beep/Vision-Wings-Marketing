import { requireAdmin } from "@/lib/auth/rbac";
import ProjectsAdminTable from "@/components/admin/ProjectsAdminTable";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // No role list here, same as before this page had any explicit check: the
  // parent /admin layout already gates entry to any resolved admin role.
  await requireAdmin();

  return <ProjectsAdminTable />;
}
