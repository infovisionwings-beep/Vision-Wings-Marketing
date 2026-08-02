import { requireAdmin } from "@/lib/auth/rbac";
import SiteContentEditor from "@/components/admin/SiteContentEditor";

export const dynamic = "force-dynamic";

export default async function SiteContentPage() {
  // Site copy follows the content designations; Developer passes any role list.
  await requireAdmin(["Admin", "SEO", "Content Manager"]);

  return (
    <div className="space-y-8">
      <header className="border-b border-navy-200 pb-6">
        <h1 className="text-3xl font-display font-bold tracking-tight text-navy-950">Site Content</h1>
        <p className="mt-2 max-w-2xl text-navy-600">
          Every heading, paragraph, image and video on the homepage, grouped by the section it
          appears in. Pick media straight from the library — or upload new media without leaving
          this page.
        </p>
      </header>

      <SiteContentEditor />
    </div>
  );
}
