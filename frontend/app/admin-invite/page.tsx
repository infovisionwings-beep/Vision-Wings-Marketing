import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, AlertCircle, LogIn } from 'lucide-react';
import { lookupInvite } from '@/app/actions/adminInvites';
import AcceptInviteClient from './client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Accept Admin Invite",
  robots: { index: false, follow: false },
};

// Deliberately outside /admin: the invitee is not an admin yet, so the admin layout
// and the Neon proxy matcher (/admin/:path*) must not apply. This page enforces its
// own rule — you must already be signed in as the invited address.
export default async function AdminInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-warm-50 font-sans">
      <div className="w-full max-w-md bg-navy-900/50 p-8 rounded-2xl border border-navy-800 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-navy-950 rounded-2xl border border-navy-800 flex items-center justify-center mb-4 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-bronze-500" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-center">Admin Invitation</h1>
        </div>
        {children}
      </div>
    </div>
  );

  const problem = (message: string) =>
    shell(
      <div className="space-y-6">
        <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200 leading-relaxed">{message}</p>
        </div>
        <Link
          href="/"
          className="flex min-h-[44px] items-center justify-center rounded-xl border border-navy-700 px-4 text-sm font-medium text-navy-200 transition-colors outline-none hover:bg-navy-800 focus-visible:ring-2 focus-visible:ring-bronze-500"
        >
          Back to site
        </Link>
      </div>
    );

  if (!token) {
    return problem('This link is missing its invite token. Open the link exactly as it appears in your email.');
  }

  const result = await lookupInvite(token);

  if ('error' in result && result.error === 'NOT_SIGNED_IN') {
    const invitedEmail = (result as any).invite?.email;
    return shell(
      <div className="space-y-6">
        <p className="text-sm text-navy-200 leading-relaxed">
          Sign in with <strong className="text-warm-50">{invitedEmail}</strong> first, then open this
          link again. The invite only opens for the account it was sent to.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/admin-invite?token=${token}`)}`}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-bronze-600 px-4 font-medium text-white shadow-lg transition-all outline-none hover:bg-bronze-500 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-bronze-400"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </Link>
      </div>
    );
  }

  if ('error' in result && result.error) {
    return problem(result.error);
  }

  const invite = (result as any).invite;

  return shell(
    <AcceptInviteClient token={token} name={invite.name} email={invite.email} role={invite.role} />
  );
}
