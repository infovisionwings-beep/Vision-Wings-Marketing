'use client'

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Mail, User, Shield, AlertCircle, CheckCircle, Loader2, X, Clock } from 'lucide-react';
import { createInvite, listInvites, revokeInvite } from '@/app/actions/adminInvites';

interface Invite {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'pending' | 'accepted' | 'revoked';
  invitedBy: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

const ROLES = [
  { value: 'Admin', label: 'Admin — photos, videos and blogs' },
  { value: 'SEO', label: 'SEO — blogs only' },
  { value: 'Content Manager', label: 'Content Manager — photos and videos only' },
];

export default function NewAdminClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');

  const [invites, setInvites] = useState<Invite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const refreshInvites = useCallback(async () => {
    const res = await listInvites();
    setInvites(res.invites || []);
    setInvitesLoading(false);
  }, []);

  useEffect(() => {
    refreshInvites();
  }, [refreshInvites]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const res = await createInvite(name, email, role);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(`Invite sent to ${email}. They set their own password from the link; it expires in 24 hours.`);
      setName('');
      setEmail('');
      refreshInvites();
    }
    setLoading(false);
  };

  const handleRevoke = async (id: string, inviteEmail: string) => {
    if (!confirm(`Revoke the pending invite for ${inviteEmail}?`)) return;
    setRevoking(id);
    const res = await revokeInvite(id);
    if (res.error) setError(res.error);
    await refreshInvites();
    setRevoking(null);
  };

  const statusStyle = (status: Invite['status']) => {
    if (status === 'accepted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'revoked') return 'bg-navy-50 text-navy-500 border-navy-200';
    return 'bg-bronze-50 text-bronze-700 border-bronze-200';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-bronze-950/30 rounded-2xl border border-bronze-900/50 flex items-center justify-center mb-4 text-bronze-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-navy-950">Invite an Admin</h1>
        <p className="text-navy-500 font-mono text-sm mt-2 uppercase tracking-widest">Single-use invite link</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-navy-100 shadow-xl shadow-navy-900/5">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800">{success}</p>
          </div>
        )}

        <p className="mb-6 text-sm text-navy-600 leading-relaxed">
          They must already have a Vision Wings account with this email — the invite link only
          opens for the account it was addressed to.
        </p>

        <form onSubmit={handleInvite} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="invite-name" className="text-xs font-mono font-medium text-navy-500 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-navy-400" />
              <input id="invite-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-navy-200 rounded-xl focus:ring-2 focus:ring-bronze-500 focus:border-bronze-500 outline-none text-navy-900" placeholder="John Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="invite-email" className="text-xs font-mono font-medium text-navy-500 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-navy-400" />
              <input id="invite-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-navy-200 rounded-xl focus:ring-2 focus:ring-bronze-500 focus:border-bronze-500 outline-none text-navy-900" placeholder="john@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="invite-role" className="text-xs font-mono font-medium text-navy-500 uppercase">Admin Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-5 w-5 text-navy-400" />
              <select id="invite-role" value={role} onChange={e => setRole(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-navy-200 rounded-xl focus:ring-2 focus:ring-bronze-500 focus:border-bronze-500 outline-none text-navy-900 appearance-none">
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full min-h-[44px] py-3 bg-navy-950 hover:bg-navy-900 text-white rounded-xl font-medium transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Sending invite…' : 'Send invite'}</span>
          </button>
        </form>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-navy-950">Recent invites</h2>

        {invitesLoading ? (
          <div className="py-10 flex justify-center text-navy-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : invites.length === 0 ? (
          <p className="bg-warm-50 p-6 rounded-xl border border-navy-100 text-sm text-navy-500 text-center">
            No invites sent yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {invites.map(invite => {
              const expired = invite.status === 'pending' && new Date(invite.expiresAt) <= new Date();
              return (
                <li key={invite.id} className="bg-white p-4 rounded-xl border border-navy-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-950 truncate">{invite.name}</p>
                    <p className="text-sm text-navy-500 truncate">{invite.email} · {invite.role}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase ${statusStyle(invite.status)}`}>
                      {expired ? 'expired' : invite.status}
                    </span>
                    {invite.status === 'pending' && !expired && (
                      <>
                        <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-navy-400">
                          <Clock className="w-3 h-3" />
                          {new Date(invite.expiresAt).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRevoke(invite.id, invite.email)}
                          disabled={revoking === invite.id}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-navy-500 transition-colors outline-none hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-50"
                          aria-label={`Revoke invite for ${invite.email}`}
                          title="Revoke invite"
                        >
                          {revoking === invite.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
