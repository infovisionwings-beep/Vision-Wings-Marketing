import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { desc } from "drizzle-orm"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await db
    .select()
    .from(userProfiles)
    .orderBy(desc(userProfiles.createdAt))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy-950">Leads</h1>
          <p className="text-navy-600 mt-1">View onboarding profiles from new signups.</p>
        </div>
      </div>

      <div className="bg-white border border-navy-100 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50 border-b border-navy-100 text-sm font-semibold text-navy-700">
                <th className="p-4 w-[200px]">Name / Type</th>
                <th className="p-4 w-[200px]">Company Info</th>
                <th className="p-4 w-[200px]">Contact</th>
                <th className="p-4">Interests</th>
                <th className="p-4 w-[150px]">Source</th>
                <th className="p-4 w-[120px]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-navy-500">
                    No leads found yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const address = lead.address as any || {}
                  const isCompany = lead.type === 'company'
                  return (
                    <tr key={lead.id} className="hover:bg-warm-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-medium text-navy-950">{lead.name}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-0.5 rounded-full ${isCompany ? 'bg-bronze-100 text-bronze-800' : 'bg-navy-100 text-navy-700'}`}>
                            {lead.type}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-top text-sm">
                        {isCompany ? (
                          <>
                            <div className="font-medium">{lead.companyName}</div>
                            <div className="text-navy-500 mt-0.5 text-xs">{lead.employeesCount} employees</div>
                          </>
                        ) : (
                          <span className="text-navy-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="p-4 align-top text-sm">
                        <div>{lead.phone}</div>
                        <div className="text-navy-500 mt-1 text-xs">
                          {isCompany 
                            ? address.fullAddress 
                            : `${address.city || ''}, ${address.country || ''}`
                          }
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex flex-wrap gap-1">
                          {(lead.interests as string[])?.map((interest, idx) => (
                            <span key={idx} className="bg-warm-100 border border-navy-100 text-navy-700 text-xs px-2 py-1 rounded-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top text-sm text-navy-600 capitalize">
                        {lead.source}
                      </td>
                      <td className="p-4 align-top text-sm text-navy-500">
                        {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
