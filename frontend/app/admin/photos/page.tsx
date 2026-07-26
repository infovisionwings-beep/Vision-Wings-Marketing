import { AdminPhotoManager } from "@/components/admin/AdminPhotoManager";

export const metadata = {
  title: "Image & GIF Pipeline - Admin Portal",
};

export default function AdminPhotosPage() {
  return (
    <div className="py-2">
      <AdminPhotoManager />
    </div>
  );
}
