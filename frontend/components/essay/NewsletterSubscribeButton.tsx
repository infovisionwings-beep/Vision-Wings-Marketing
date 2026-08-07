"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Loader2, Mail } from "lucide-react";
import { subscribeToNewsletter, unsubscribeFromNewsletter } from "@/app/actions/newsletter";

/**
 * One button, no email field.
 *
 * The box used to be a bare <input> beside a <Button> wired to nothing — no
 * handler, no action, no table. Taking an address from that field would also
 * have let anyone sign up an address they do not own, so the address now comes
 * from the session instead and the field is gone.
 *
 * Subscribing is a signed-in action while reading an essay is not, so a signed
 * out reader is sent to sign in and returned to the essay they were on, the
 * same way the save button behaves.
 */
export default function NewsletterSubscribeButton({
  initiallySubscribed = false,
  /** The dashboard is where a subscription is managed, so that is the only
   *  place that offers to undo it. On an essay the button just goes quiet. */
  allowUnsubscribe = false,
}: {
  initiallySubscribed?: boolean;
  allowUnsubscribe?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [subscribed, setSubscribed] = useState(initiallySubscribed);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleClick = async () => {
    if (subscribed && !allowUnsubscribe) return;

    setPending(true);
    const previous = subscribed;
    setSubscribed(!previous);

    try {
      const result = previous ? await unsubscribeFromNewsletter() : await subscribeToNewsletter();

      if ("requiresLogin" in result && result.requiresLogin) {
        setSubscribed(previous);
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (result.error) {
        setSubscribed(previous);
        setMessage(result.error);
        return;
      }
      setSubscribed(result.subscribed);
      setMessage(result.subscribed ? "You're subscribed." : "You've been unsubscribed.");
    } catch {
      setSubscribed(previous);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  // Subscribed with nowhere to undo it is a statement, not a control — so it
  // renders as one rather than as a button that ignores its own clicks.
  if (subscribed && !allowUnsubscribe) {
    return (
      <div className="space-y-2">
        <p className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-bronze-500/50 bg-bronze-50 px-4 text-sm font-bold text-bronze-800">
          <Check className="h-4 w-4" />
          <span>Subscribed</span>
        </p>
        <p className="text-center text-[11px] text-navy-500">
          Manage this from your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={subscribed}
        className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-60 ${
          subscribed
            ? "border border-navy-300 bg-warm-100 text-navy-800 hover:bg-warm-200"
            : "bg-navy-950 text-warm-50 hover:bg-navy-900"
        }`}
        data-interactive
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : subscribed ? (
          <Check className="h-4 w-4" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        <span>
          {pending ? "Just a moment…" : subscribed ? "Subscribed — unsubscribe" : "Subscribe"}
        </span>
      </button>

      <p role="status" aria-live="polite" className="min-h-[15px] text-center text-[11px] text-navy-500">
        {message}
      </p>
    </div>
  );
}
