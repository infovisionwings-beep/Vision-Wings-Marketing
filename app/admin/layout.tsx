import { Link } from "@/components/ui/Link";
import { Eye, Briefcase, FileText, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-950 text-warm-50 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-navy-700">
          <Link href="/admin" className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-bronze-500" />
            <span className="font-display font-bold text-lg">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin/projects" className="flex items-center gap-3 p-3 rounded-sm hover:bg-navy-900 transition-colors">
            <Briefcase className="w-5 h-5 text-bronze-500" />
            <span className="font-medium">Projects</span>
          </Link>
          <Link href="/admin/insights" className="flex items-center gap-3 p-3 rounded-sm hover:bg-navy-900 transition-colors">
            <FileText className="w-5 h-5 text-bronze-500" />
            <span className="font-medium">Insights</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-navy-700">
          <button className="flex items-center gap-3 p-3 rounded-sm hover:bg-navy-900 transition-colors w-full text-left text-navy-300 hover:text-warm-50">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white border-b border-navy-100 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-h4 text-navy-950 md:hidden">Admin Portal</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        <div className="p-8 flex-1 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
