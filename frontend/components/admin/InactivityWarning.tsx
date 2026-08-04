'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { logoutAdmin, touchAdminSession } from '@/app/actions/adminAuth';

const IDLE_LIMIT_MS = 15 * 60 * 1000;
const WARN_AT_MS = 14 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000;
const TICK_MS = 5000;

/**
 * The visible half of the idle timeout. The enforcement lives in the
 * `admin_activity` cookie and `requireAdmin` — this only keeps that cookie alive
 * while the admin is actually working, and gives them a minute of warning before
 * it lapses. With scripting disabled the timeout still fires; it just arrives
 * without the courtesy notice.
 */
export function InactivityWarning() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const lastActivity = useRef(Date.now());
  const lastHeartbeat = useRef(Date.now());
  const endingSession = useRef(false);

  const endSession = useCallback(() => {
    if (endingSession.current) return;
    endingSession.current = true;
    logoutAdmin();
  }, []);

  const stayOnline = useCallback(() => {
    lastActivity.current = Date.now();
    lastHeartbeat.current = Date.now();
    setSecondsLeft(null);
    touchAdminSession().then((res) => {
      // The cookie already lapsed while the dialog was open — the server has
      // closed the session and the dashboard behind it is no longer readable.
      if (!res.active) router.replace('/admin-login?reason=idle');
    });
  }, [router]);

  useEffect(() => {
    const markActive = () => {
      lastActivity.current = Date.now();
      if (Date.now() - lastHeartbeat.current > HEARTBEAT_INTERVAL_MS) {
        lastHeartbeat.current = Date.now();
        touchAdminSession();
      }
    };

    const events = ['pointerdown', 'keydown', 'scroll', 'focus'] as const;
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const tick = setInterval(() => {
      const idleFor = Date.now() - lastActivity.current;
      if (idleFor >= IDLE_LIMIT_MS) {
        endSession();
      } else if (idleFor >= WARN_AT_MS) {
        setSecondsLeft(Math.ceil((IDLE_LIMIT_MS - idleFor) / 1000));
      } else if (secondsLeft !== null) {
        setSecondsLeft(null);
      }
    }, TICK_MS);

    return () => {
      clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, markActive));
    };
  }, [endSession, secondsLeft]);

  if (secondsLeft === null) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="idle-title"
      aria-describedby="idle-body"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/70 p-5 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-navy-200 bg-warm-50 p-7 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)]">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-bronze-50 text-bronze-700">
            <Clock className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 id="idle-title" className="text-h3 font-bold text-navy-950">
              Still there?
            </h2>
            <p id="idle-body" className="mt-2 text-body-sm leading-relaxed text-navy-700">
              This session closes after 15 minutes without activity. It will sign you
              out in{' '}
              <span className="font-mono font-semibold text-navy-950 tabular-nums">
                {secondsLeft}s
              </span>
              . Unsaved changes on this page will be lost.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={endSession}
            className="min-h-[44px] rounded-lg px-5 text-sm font-medium text-navy-700 outline-none transition-colors hover:bg-navy-100 focus-visible:ring-2 focus-visible:ring-bronze-500"
            data-interactive
          >
            Sign out now
          </button>
          <button
            type="button"
            autoFocus
            onClick={stayOnline}
            className="min-h-[44px] rounded-lg bg-navy-950 px-6 text-sm font-semibold text-warm-50 shadow-sm outline-none transition-colors hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 focus-visible:ring-offset-2"
            data-interactive
          >
            Keep me signed in
          </button>
        </div>
      </div>
    </div>
  );
}
