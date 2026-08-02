import { requireAdmin } from "@/lib/auth/rbac";
import ClientLogosAdmin from "@/components/admin/ClientLogosAdmin";

export const dynamic = "force-dynamic";

export default async function ClientLogosPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="border-b border-navy-200 pb-6">
        <h1 className="text-3xl font-display font-bold tracking-tight text-navy-950">Client Logos</h1>
        <p className="mt-2 max-w-2xl text-navy-600">
          Company logos shown in the scrolling marquee on the homepage. Add, edit, archive, or
          permanently delete each one below.
        </p>
      </header>

      <ClientLogosAdmin />
    </div>
  );
}
