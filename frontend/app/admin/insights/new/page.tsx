import { InsightForm } from "@/components/admin/InsightForm";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";

export const metadata = {
  title: "New Dispatch Dossier - Admin Portal",
};

export default async function NewInsightPage() {
  await requireAdmin(rolesFor("/admin/insights"));
  return (
    <div className="py-2">
      <h1 className="text-h2 text-navy-950 font-display font-bold mb-8">Create New Dispatch Dossier</h1>
      <InsightForm />
    </div>
  );
}
