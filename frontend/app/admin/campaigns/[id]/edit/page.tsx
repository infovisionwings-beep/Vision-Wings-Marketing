import CampaignForm from "@/components/admin/CampaignForm";
import { getCampaignById } from "@/app/actions/campaigns";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Was an unqualified requireAdmin(), so any resolved role could edit a
  // campaign through a direct URL even when the list page was closed to them.
  await requireAdmin(rolesFor("/admin/campaigns"));
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
