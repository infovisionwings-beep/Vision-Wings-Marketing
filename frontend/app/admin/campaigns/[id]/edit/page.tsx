import CampaignForm from "@/components/admin/CampaignForm";
import { getCampaignById } from "@/app/actions/campaigns";
import { requireAdmin } from "@/lib/auth/rbac";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const resolvedParams = await params;
  const campaign = await getCampaignById(resolvedParams.id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CampaignForm campaign={campaign} />
    </div>
  );
}
