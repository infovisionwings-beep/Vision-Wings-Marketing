// Reading this as: Executive prospect intelligence table for an elite digital branding agency, using high-contrast editorial tables and monospace data badges.
// DESIGN_VARIANCE: 7
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 6

import { format } from "date-fns";
import { db } from "@/lib/db";
import { userProfiles, contactSubmissions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/rbac";
import { rolesFor } from "@/lib/auth/adminAccess";
import { Users, Building2, User, Phone, MapPin, Sparkles, Mail, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  // This page had no role check of its own while listing names, emails, phone
  // numbers and enquiry text — the layout's "any resolved admin role" gate was
  // the only thing in front of it.
  await requireAdmin(rolesFor("/admin/leads"));
  let leads: any[] = [];
  let inquiries: any[] = [];
  try {
    leads = await db
      .select()
      .from(userProfiles)
      .orderBy(desc(userProfiles.createdAt));
  } catch (error) {
    console.error("Failed to fetch leads from Neon DB:", error);
  }
  try {
    inquiries = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  } catch (error) {
    console.error("Failed to fetch contact submissions from Neon DB:", error);
  }

  return (
    <div className="space-y-14">

      {/* Contact Inquiries — submissions from the public /contact form */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-navy-200 pb-6">
          <h1 className="text-h2 font-bold text-navy-950 tracking-tight">Contact Inquiries</h1>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warm-200 text-navy-900 text-sm font-medium">
            <Mail className="w-4 h-4 text-bronze-700" />
            {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
          </span>
        </div>

        {inquiries.length === 0 ? (
          <p className="rounded-xl border border-navy-200 bg-warm-50 p-8 text-center text-sm text-navy-500">
            No inquiries yet. Submissions from <span className="font-medium text-navy-700">/contact</span> appear here automatically.
          </p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((item: any, idx: number) => (
              <article key={item.id || idx} className="rounded-xl border border-navy-200 bg-warm-50 p-4 sm:p-5 space-y-2.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-navy-950">{item.firstName} {item.lastName}</h2>
                    <a href={`mailto:${item.email}`} className="text-sm text-bronze-700 hover:text-bronze-800 underline underline-offset-2">
                      {item.email}
                    </a>
                    {item.company && <span className="text-sm text-navy-500"> · {item.company}</span>}
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-navy-500">
                    {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "Today"}
                  </span>
                </div>
                <p className="flex gap-2 text-sm text-navy-700 leading-relaxed border-t border-navy-200 pt-2.5">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-navy-400 mt-0.5" />
                  <span>{item.message}</span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Leads — signups from the authenticated /onboarding flow */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-navy-200 pb-6">
          <h1 className="text-h2 font-bold text-navy-950 tracking-tight">Leads</h1>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warm-200 text-navy-900 text-sm font-medium">
            <Users className="w-4 h-4 text-bronze-700" />
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </span>
        </div>

      {/* Cards below md — a 6-column table in a horizontal scroller is unusable on a phone */}
      <div className="md:hidden space-y-3">
        {leads.length === 0 ? (
          <p className="rounded-xl border border-navy-200 bg-warm-50 p-8 text-center text-sm text-navy-500">
            No leads yet. Signups from <span className="font-medium text-navy-700">/onboarding</span> appear here automatically.
          </p>
        ) : (
          leads.map((lead: any, idx: number) => {
            const address = (lead.address as any) || {};
            const isCompany = lead.type === "company";
            return (
              <article key={lead.id || idx} className="rounded-xl border border-navy-200 bg-warm-50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-navy-950">{lead.name}</h2>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isCompany ? "bg-navy-950 text-warm-50" : "bg-warm-200 text-navy-800"
                  }`}>
                    {isCompany ? <Building2 className="w-3 h-3 text-bronze-400" /> : <User className="w-3 h-3" />}
                    {isCompany ? "Company" : "Individual"}
                  </span>
                </div>

                {isCompany && (
                  <p className="text-sm text-navy-700">
                    <span className="font-semibold">{lead.companyName}</span>
                    {lead.employeesCount ? <span className="text-navy-500"> · {lead.employeesCount} employees</span> : null}
                  </p>
                )}

                <dl className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Phone</dt>
                    <Phone className="w-3.5 h-3.5 shrink-0 text-bronze-600" />
                    <dd>{lead.phone
                      ? <a href={`tel:${lead.phone}`} className="text-navy-900 underline underline-offset-2">{lead.phone}</a>
                      : <span className="text-navy-500">No phone</span>}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <dt className="sr-only">Location</dt>
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-navy-400 mt-0.5" />
                    <dd className="text-navy-600">
                      {isCompany
                        ? address.fullAddress || "Remote / Global"
                        : [address.city, address.country].filter(Boolean).join(", ") || "Remote / Global"}
                    </dd>
                  </div>
                </dl>

                {(lead.interests as string[])?.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {(lead.interests as string[]).map((interest: string, iIdx: number) => (
                      <li key={iIdx} className="rounded bg-navy-900 px-2 py-0.5 text-[11px] text-warm-100">
                        {interest}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="border-t border-navy-200 pt-2.5 text-xs text-navy-500">
                  {lead.source || "Direct"} · {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : "Today"}
                </p>
              </article>
            );
          })
        )}
      </div>

      {/* Table from md up */}
      <div className="hidden md:block bg-warm-50 rounded-2xl border border-navy-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-950 text-warm-50 text-[11px] font-semibold uppercase tracking-wider">
                <th scope="col" className="py-4 px-6 w-12">#</th>
                <th scope="col" className="py-4 px-6">Name</th>
                <th scope="col" className="py-4 px-6">Company</th>
                <th scope="col" className="py-4 px-6">Contact</th>
                <th scope="col" className="py-4 px-6">Interests</th>
                <th scope="col" className="py-4 px-6 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-200/60 text-sm">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-navy-500">
                    No leads yet. Signups from <span className="font-medium text-navy-700">/onboarding</span> appear here automatically.
                  </td>
                </tr>
              ) : (
                leads.map((lead: any, idx: number) => {
                  const address = lead.address as any || {};
                  const isCompany = lead.type === "company";
                  return (
                    <tr key={lead.id || idx} className="hover:bg-warm-100/70 transition-colors group">
                      <td className="py-4 px-6 font-mono text-xs text-navy-400 font-semibold align-top">
                        0{idx + 1}
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-navy-950 group-hover:text-bronze-700 transition-colors text-base">
                          {lead.name}
                        </div>
                        <div className="mt-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                            isCompany 
                              ? "bg-navy-950 text-warm-50 border border-navy-800" 
                              : "bg-warm-200 text-navy-800 border border-navy-300/60"
                          }`}>
                            {isCompany ? <Building2 className="w-3 h-3 text-bronze-400" /> : <User className="w-3 h-3" />}
                            <span className="uppercase">{lead.type}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top font-sans">
                        {isCompany ? (
                          <div className="space-y-1">
                            <div className="font-bold text-navy-900">{lead.companyName}</div>
                            <div className="text-xs font-mono text-navy-500 bg-warm-100 px-2 py-0.5 rounded inline-block">
                              {lead.employeesCount} Employees
                            </div>
                          </div>
                        ) : (
                          <span className="text-navy-400 font-mono text-xs italic">Individual Practitioner</span>
                        )}
                      </td>
                      <td className="py-4 px-6 align-top space-y-1 text-xs">
                        <div className="flex items-center gap-2 font-mono text-navy-900 font-medium">
                          <Phone className="w-3.5 h-3.5 text-bronze-600 flex-shrink-0" />
                          <span>{lead.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-start gap-2 text-navy-600">
                          <MapPin className="w-3.5 h-3.5 text-navy-400 flex-shrink-0 mt-0.5" />
                          <span>
                            {isCompany 
                              ? address.fullAddress || "Remote / Global"
                              : `${address.city || ""}, ${address.country || ""}` || "Remote / Global"
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {(lead.interests as string[])?.map((interest: string, iIdx: number) => (
                            <span key={iIdx} className="bg-navy-900 text-warm-100 border border-navy-700 text-[11px] font-mono px-2 py-0.5 rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top text-right space-y-1">
                        <div className="font-mono text-xs font-bold text-bronze-700 uppercase">
                          {lead.source || "Direct"}
                        </div>
                        <div className="font-mono text-[11px] text-navy-500">
                          {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : "Today"}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </section>
    </div>
  );
}

