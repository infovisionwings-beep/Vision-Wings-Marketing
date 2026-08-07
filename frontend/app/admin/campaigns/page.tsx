import { getAdminCampaigns } from "@/app/actions/campaigns";
import AdminCampaignManager from "@/components/admin/AdminCampaignManager";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  // Placing media on the public site is the Content Manager's responsibility.
  // The role list comes from the same map the nav filters on.
  await requireAdmin(rolesFor("/admin/campaigns"));
  const initialCampaigns = await getAdminCampaigns();

  return (
    <div className="space-y-8">
      <AdminCampaignManager initialCampaigns={initialCampaigns} />
    </div>
  );
}
