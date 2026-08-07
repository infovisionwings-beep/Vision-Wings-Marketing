import { AdminInsightsManager } from "@/components/admin/AdminInsightsManager";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";

export const metadata = {
  title: "Insights Management - Admin Portal",
};

// Written content belongs to SEO. The role list comes from the same map the nav
// filters on, so this page cannot enforce something the sidebar contradicts.
export default async function AdminInsightsPage() {
  await requireAdmin(rolesFor("/admin/insights"));
  return (
    <div className="py-2">
      <AdminInsightsManager />
    </div>
  );
}
