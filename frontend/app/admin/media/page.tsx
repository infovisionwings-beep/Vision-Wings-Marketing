import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

/**
 * One Media Library replacing the separate /admin/photos and /admin/videos
 * pipeline pages. Those still exist as redirects so older bookmarks and the
 * links inside the pipeline console do not 404.
 */
export default async function MediaLibraryPage() {
  await requireAdmin(rolesFor("/admin/media"));

  return (
    <div className="space-y-8">
      <header className="border-b border-navy-200 pb-6">
        <h1 className="text-3xl font-display font-bold tracking-tight text-navy-950">Media Library</h1>
        <p className="mt-2 max-w-2xl text-navy-600">
          Everything uploaded to the site. Images are converted to WebP and videos to WebM and MP4
          automatically. To put a piece of media on the homepage, use{" "}
          <span className="font-semibold text-navy-900">Site Content</span> and pick it there.
        </p>
      </header>

      <MediaLibrary />
    </div>
  );
}
