"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

/**
 * Signing out lives here rather than in the nav.
 *
 * The mobile dock had exactly one account control and it was Logout, so a phone
 * user could leave their account but never reach it. The dock now links to the
 * dashboard and this is the way out, which also means one control instead of
 * two that differed by screen width.
 */
export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => { logoutUser(); })}
      disabled={isPending}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-navy-300 bg-warm-100 px-5 text-sm font-semibold text-navy-800 outline-none transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-bronze-500 disabled:opacity-60"
      data-interactive
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      <span>{isPending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
