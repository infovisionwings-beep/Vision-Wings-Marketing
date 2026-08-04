import CampaignForm from "@/components/admin/CampaignForm";
import { requireAdmin } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  await requireAdmin(["SEO"]);
  const resolvedParams = await searchParams;
  const defaultSection = resolvedParams?.section || "showcases";

  return (
    <div className="space-y-6">
      <CampaignForm defaultSection={defaultSection} />
    </div>
  );
}
