import { redirect } from "next/navigation";

// Folded into the single Media Library. Kept as a redirect so existing
// bookmarks and links do not 404.
export default function AdminVideosPage() {
  redirect("/admin/media");
}
