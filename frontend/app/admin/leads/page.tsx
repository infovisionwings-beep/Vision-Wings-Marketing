// Reading this as: Executive prospect intelligence table for an elite digital branding agency, using high-contrast editorial tables and monospace data badges.
// DESIGN_VARIANCE: 7
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 6

import { format } from "date-fns";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Users, Building2, User, Phone, MapPin, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  let leads: any[] = [];
  try {
    leads = await db
      .select()
      .from(userProfiles)
      .orderBy(desc(userProfiles.createdAt));
  } catch (error) {
    console.error("Failed to fetch leads from Neon DB:", error);
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-navy-200/80 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-bronze-600 block mb-1">
            PROSPECT INTEL / 04
          </span>
          <h1 className="text-display sm:text-h2 font-bold text-navy-950 tracking-tight">
            Onboarding Dossiers
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warm-200/80 border border-navy-300/40 text-navy-900 font-mono text-xs font-bold">
          <Users className="w-4 h-4 text-bronze-700" />
          <span>{leads.length} LEADS INDEXED</span>
        </div>
      </div>

      {/* High-Contrast Editorial Table */}
      <div className="bg-warm-50 rounded-2xl shadow-xl border border-navy-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-950 text-warm-50 text-[11px] font-mono font-semibold uppercase tracking-wider border-b border-navy-800">
                <th className="py-4 px-6 w-12">#</th>
                <th className="py-4 px-6">Prospect Entity</th>
                <th className="py-4 px-6">Organization Profile</th>
                <th className="py-4 px-6">Direct Credentials</th>
                <th className="py-4 px-6">Strategic Vectors</th>
                <th className="py-4 px-6 text-right">Acquisition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-200/60 text-sm">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-navy-400 font-mono text-xs">
                    No client dossiers recorded in database yet. New signups from `/onboarding` will populate here automatically.
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
    </div>
  );
}
