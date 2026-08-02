'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { acceptInvite } from '@/app/actions/adminInvites';

const MIN_PASSWORD_LENGTH = 12;

export default function AcceptInviteClient({
  token,
  name,
  email,
  role,
}: {
  token: string;
  name: string;
  email: string;
  role: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await acceptInvite(token, password);
    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push('/admin-login'), 2500);
  };

  if (done) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-emerald-950/50 border border-emerald-900/50 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-100 leading-relaxed">
            You are now a <strong>{role}</strong>. Taking you to the admin sign-in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 text-sm text-navy-200 space-y-1">
        <p>Hi <strong className="text-warm-50">{name}</strong>,</p>
        <p>
          You have been invited as <strong className="text-bronze-400">{role}</strong> for{' '}
          <strong className="text-warm-50">{email}</strong>. Set a password to finish — only you will know it.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="invite-password" className="text-xs font-mono font-medium text-navy-300 uppercase tracking-wider block">
          Choose a password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-500" />
          <input
            id="invite-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-800 rounded-xl focus:ring-2 focus:ring-bronze-500/50 focus:border-bronze-500 transition-all outline-none text-warm-50 placeholder-navy-600"
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="invite-password-confirm" className="text-xs font-mono font-medium text-navy-300 uppercase tracking-wider block">
          Confirm password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-500" />
          <input
            id="invite-password-confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-800 rounded-xl focus:ring-2 focus:ring-bronze-500/50 focus:border-bronze-500 transition-all outline-none text-warm-50 placeholder-navy-600"
            placeholder="Repeat it"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[44px] py-3.5 px-4 bg-bronze-600 hover:bg-bronze-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-bronze-900/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{loading ? 'Setting up…' : 'Accept invitation'}</span>
      </button>
    </form>
  );
}
