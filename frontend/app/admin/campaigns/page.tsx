import { getAdminCampaigns } from "@/app/actions/campaigns";
import AdminCampaignManager from "@/components/admin/AdminCampaignManager";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const initialCampaigns = await getAdminCampaigns();

  return (
    <div className="space-y-8">
      <AdminCampaignManager initialCampaigns={initialCampaigns} />
    </div>
  );
}
