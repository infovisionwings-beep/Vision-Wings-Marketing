import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Link } from "@/components/ui/Link";
import { getAccountSummary } from "@/app/actions/account";
import { getSavedEssays } from "@/app/actions/savedEssays";
import SavedEssayCard, { EmptyLibrary } from "@/components/account/SavedEssayCard";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Your Dashboard",
  description: "Your Vision Wings account details and saved essays.",
  path: "/dashboard",
  noindex: true,
});

/** A labelled value, or nothing at all — a field with no answer is not a row. */
function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="py-3.5">
      <dt className="text-[11px] font-mono font-semibold uppercase tracking-widest text-navy-500">
        {label}
      </dt>
      <dd className="mt-1 text-body text-navy-950">{value}</dd>
    </div>
  );
}

export default async function DashboardPage() {
  const [account, essays] = await Promise.all([getAccountSummary(), getSavedEssays()]);

  // The proxy already gates /dashboard on a session; this covers the gap
  // between the cookie existing and the session behind it still resolving.
  if (!account) redirect("/login?next=%2Fdashboard");

  const { profile } = account;

  return (
    <div className="min-h-screen bg-warm-50 px-5 pb-24 pt-32 text-navy-950 md:px-10 xl:px-20">
      <div className="mx-auto max-w-[1080px] space-y-14">

        <header className="border-b border-navy-200 pb-9">
          <h1 className="text-display font-bold leading-[1.05] tracking-tight text-balance">
            {account.displayName}
          </h1>
          <p className="mt-3 font-mono text-body-sm text-navy-600">{account.email}</p>
          {account.memberSince && (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-navy-500">
              Member since {format(new Date(account.memberSince), "MMMM yyyy")}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">

          <section className="lg:col-span-7" aria-labelledby="library-heading">
            <div className="flex items-baseline justify-between gap-4 border-b border-navy-200 pb-4">
              <h2 id="library-heading" className="text-h2 font-bold tracking-tight">
                Saved essays
              </h2>
              <span className="flex-shrink-0 font-mono text-[11px] uppercase tracking-widest text-navy-500">
                {essays.length} {essays.length === 1 ? "essay" : "essays"}
              </span>
            </div>

            {essays.length === 0 ? (
              <div className="pt-8">
                <EmptyLibrary />
              </div>
            ) : (
              <ul className="pt-5">
                {essays.map((essay) => (
                  <SavedEssayCard key={essay.insightId} essay={essay} />
                ))}
              </ul>
            )}
          </section>

          <section className="lg:col-span-5" aria-labelledby="details-heading">
            <div className="border-b border-navy-200 pb-4">
              <h2 id="details-heading" className="text-h2 font-bold tracking-tight">
                Your details
              </h2>
            </div>

            {profile ? (
              <>
                <dl className="divide-y divide-navy-200/70 pt-2">
                  <Detail label="Name" value={profile.name} />
                  <Detail
                    label="Account type"
                    value={profile.type === "company" ? "Company" : "Individual"}
                  />
                  <Detail label="Company" value={profile.companyName} />
                  <Detail label="Team size" value={profile.employeesCount} />
                  <Detail label="Phone" value={profile.phone} />
                  <Detail label="Location" value={profile.location} />
                  <Detail label="Found us via" value={profile.source} />
                </dl>

                {profile.interests.length > 0 && (
                  <div className="border-t border-navy-200/70 pt-5">
                    <h3 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-navy-500">
                      Interests
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <li
                          key={interest}
                          className="rounded-full border border-navy-200 bg-warm-100 px-3 py-1.5 text-xs font-medium text-navy-800"
                        >
                          {interest}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="pt-6">
                <p className="text-body-sm leading-relaxed text-navy-600">
                  We do not have your details yet. Completing onboarding lets us tailor what we send
                  you.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-5 inline-flex min-h-[44px] items-center rounded-lg bg-navy-950 px-6 text-sm font-semibold text-warm-50 outline-none transition-colors hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-bronze-500 focus-visible:ring-offset-2"
                  data-interactive
                >
                  Complete your profile
                </Link>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
