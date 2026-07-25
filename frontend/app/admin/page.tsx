import { getProjects } from "@/app/actions/projects";
import { getInsights } from "@/app/actions/insights";
import { Link } from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  try {
    const projects = await getProjects();
    const insights = await getInsights();

    return (
      <div>
        <h1 className="text-h2 text-navy-950 mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-navy-100">
            <h2 className="text-h4 text-navy-900 mb-2">Projects</h2>
            <p className="text-display text-bronze-500 mb-6">{projects.length}</p>
            <Link href="/admin/projects" className="text-navy-700 hover:text-bronze-500 font-medium flex items-center gap-2 transition-colors">
              Manage Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-sm shadow-sm border border-navy-100">
            <h2 className="text-h4 text-navy-900 mb-2">Insights</h2>
            <p className="text-display text-bronze-500 mb-6">{insights.length}</p>
            <Link href="/admin/insights" className="text-navy-700 hover:text-bronze-500 font-medium flex items-center gap-2 transition-colors">
              Manage Insights <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    console.log("=== EXACT DB ERROR ===");
    console.log(e);
    if (e.cause) console.log("CAUSE:", e.cause);
    
    return (
      <div className="p-8 text-red-500">
        <h2>Database Connection Error</h2>
        <pre>{e.message}</pre>
        <pre>Cause: {e.cause ? e.cause.message : 'No cause attached'}</pre>
        <p>Check your terminal for the full error.</p>
      </div>
    );
  }
}
