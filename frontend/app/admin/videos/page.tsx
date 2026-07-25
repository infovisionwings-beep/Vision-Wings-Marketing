import { AdminVideoManager } from "@/components/admin/AdminVideoManager";

export const metadata = {
  title: "Video Management - Admin Portal",
};

export default function AdminVideosPage() {
  return (
    <div className="py-2">
      <AdminVideoManager />
    </div>
  );
}
