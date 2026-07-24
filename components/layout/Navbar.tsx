"use client";

import { useState } from "react";
import { Link } from "@/components/ui/Link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Button from "@/components/ui/Button";
import { Eye, Target, Briefcase, FileText, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const activeSection = useActiveSection(["vision", "strategy", "work", "insights", "contact"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // We don't have window during SSR
    if (typeof window !== "undefined") {
      if (latest > window.innerHeight * 0.8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
  });

  const isActive = (path: string, hash: string) => {
    // If it's a hash link on the homepage
    if (path === "/") {
      return pathname === "/" && activeSection === hash;
    }
    // If it's a separate page like /contact
    return pathname === path;
  };

  return (
    <>
      {/* Top Navbar (Desktop + Logo on Mobile) */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 xl:px-20 py-6 transition-colors duration-[350ms] ease-out-expo ${
          isScrolled 
            ? "bg-warm-50/96 border-b border-navy-100 backdrop-blur-sm" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 z-50" data-interactive>
            <img src="/logo-svg/Primary%20ICON.svg" alt="Vision Wing Logo" className="h-14 w-auto" />
            <span className="font-display font-bold text-xl text-navy-950 mt-1">
              Vision Wing
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            <Link 
              href="/#vision" 
              className={`text-body font-medium transition-all px-4 py-2 rounded-full ${isActive("/", "vision") ? "bg-navy-950 text-warm-50" : "hover:text-bronze-500 hover:bg-warm-100"}`} 
              data-interactive
            >
              Vision
            </Link>
            <Link 
              href="/#strategy" 
              className={`text-body font-medium transition-all px-4 py-2 rounded-full ${isActive("/", "strategy") ? "bg-navy-950 text-warm-50" : "hover:text-bronze-500 hover:bg-warm-100"}`} 
              data-interactive
            >
              Strategy
            </Link>
            <Link 
              href="/#work" 
              className={`text-body font-medium transition-all px-4 py-2 rounded-full ${isActive("/", "work") ? "bg-navy-950 text-warm-50" : "hover:text-bronze-500 hover:bg-warm-100"}`} 
              data-interactive
            >
              Work
            </Link>
            <Link 
              href="/#insights" 
              className={`text-body font-medium transition-all px-4 py-2 rounded-full ${isActive("/", "insights") ? "bg-navy-950 text-warm-50" : "hover:text-bronze-500 hover:bg-warm-100"}`} 
              data-interactive
            >
              Insights
            </Link>
            <div className="ml-6">
              <Link href="/contact" data-interactive>
                <Button variant="primary" data-interactive>Let's Build Together</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-warm-50/96 backdrop-blur-md border-t border-navy-100 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <div className="flex justify-between items-center px-6 pt-4">
          <Link href="/#vision" className="flex flex-col items-center gap-1 group" data-interactive>
            <Eye className={`w-6 h-6 transition-colors ${isActive("/", "vision") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`} />
            <span className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${isActive("/", "vision") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`}>Vision</span>
          </Link>
          
          <Link href="/#strategy" className="flex flex-col items-center gap-1 group" data-interactive>
            <Target className={`w-6 h-6 transition-colors ${isActive("/", "strategy") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`} />
            <span className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${isActive("/", "strategy") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`}>Strategy</span>
          </Link>

          <Link href="/#work" className="flex flex-col items-center gap-1 group" data-interactive>
            <Briefcase className={`w-6 h-6 transition-colors ${isActive("/", "work") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`} />
            <span className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${isActive("/", "work") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`}>Work</span>
          </Link>

          <Link href="/#insights" className="flex flex-col items-center gap-1 group" data-interactive>
            <FileText className={`w-6 h-6 transition-colors ${isActive("/", "insights") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`} />
            <span className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${isActive("/", "insights") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`}>Insights</span>
          </Link>

          <Link href="/contact" className="flex flex-col items-center gap-1 group" data-interactive>
            <Mail className={`w-6 h-6 transition-colors ${isActive("/contact", "contact") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`} />
            <span className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${isActive("/contact", "contact") ? "text-bronze-900" : "text-navy-500 group-hover:text-bronze-900"}`}>Contact</span>
          </Link>
        </div>
      </div>
    </>
  );
}
