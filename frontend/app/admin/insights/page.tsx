import { AdminInsightsManager } from "@/components/admin/AdminInsightsManager";

export const metadata = {
  title: "Insights Management - Admin Portal",
};

export default function AdminInsightsPage() {
  return (
    <div className="py-2">
      <AdminInsightsManager />
    </div>
  );
}
