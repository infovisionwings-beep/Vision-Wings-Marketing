import { getProjects } from "@/app/actions/projects";
import { Link } from "@/components/ui/Link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

export default async function ProjectsPage() {
  let projects: any[] = [];
  let dbError = null;
  
  try {
    projects = await getProjects();
  } catch (e: any) {
    console.error("DB Error on Projects page:", e);
    dbError = e;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-h2 text-navy-950">Projects</h1>
        <Link href="/admin/projects/new">
          <Button variant="primary" className="py-2 px-4 gap-2 text-sm flex items-center">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </Link>
      </div>
      
      {dbError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 mb-8">
          <h3 className="font-semibold mb-2">Network/Database Error</h3>
          <p>Your local network timed out while connecting to Neon. This is the exact same network issue affecting the main admin page.</p>
          <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded border border-red-100">
            {dbError.message}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-sm shadow-sm border border-navy-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-warm-50 border-b border-navy-100">
            <tr>
              <th className="p-4 font-medium text-navy-700">Title</th>
              <th className="p-4 font-medium text-navy-700">Category</th>
              <th className="p-4 font-medium text-navy-700">Featured</th>
              <th className="p-4 font-medium text-navy-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-navy-300">No projects found. Create your first one.</td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="border-b border-navy-100 last:border-0 hover:bg-warm-50 transition-colors">
                  <td className="p-4 font-medium text-navy-900">{project.title}</td>
                  <td className="p-4 text-navy-500">{project.category}</td>
                  <td className="p-4 text-navy-500">{project.isFeatured ? "Yes" : "No"}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-bronze-500 hover:text-bronze-700 font-medium">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
