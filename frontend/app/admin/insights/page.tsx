import { AdminInsightsManager } from "@/components/admin/AdminInsightsManager";
import { requireAdmin } from "@/lib/auth/rbac";

export const metadata = {
  title: "Insights Management - Admin Portal",
};

// Written content belongs to the Content Manager. Developer (the super admin)
// and Admin always pass inside requireAdmin.
export default async function AdminInsightsPage() {
  await requireAdmin(["Content Manager"]);
  return (
    <div className="py-2">
      <AdminInsightsManager />
    </div>
  );
}
