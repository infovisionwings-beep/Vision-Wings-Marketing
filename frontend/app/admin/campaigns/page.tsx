import { getAdminCampaigns } from "@/app/actions/campaigns";
import AdminCampaignManager from "@/components/admin/AdminCampaignManager";
import { requireAdmin } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  // Placing media on the public site is an SEO responsibility. Developer (the
  // super admin) and Admin always pass inside requireAdmin.
  await requireAdmin(["SEO"]);
  const initialCampaigns = await getAdminCampaigns();

  return (
    <div className="space-y-8">
      <AdminCampaignManager initialCampaigns={initialCampaigns} />
    </div>
  );
}
