import { InsightForm } from "@/components/admin/InsightForm";

export const metadata = {
  title: "New Dispatch Dossier - Admin Portal",
};

export default function NewInsightPage() {
  return (
    <div className="py-2">
      <h1 className="text-h2 text-navy-950 font-display font-bold mb-8">Create New Dispatch Dossier</h1>
      <InsightForm />
    </div>
  );
}
