import { requireAdmin, requireAdminToken } from '@/lib/auth/rbac';
import NewAdminClient from './client';

export const dynamic = 'force-dynamic';

export default async function NewAdminPage() {
  // This page is strictly for the Super Admin (Developer role)
  await requireAdmin(['Developer']);
  // The promotion actions need the bearer token, else they return "Unauthorized"
  // only after the super admin has filled in the whole form.
  await requireAdminToken();

  return (
    <div className="py-8">
      <NewAdminClient />
    </div>
  );
}
