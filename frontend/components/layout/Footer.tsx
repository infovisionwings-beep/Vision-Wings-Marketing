"use client";

import { Link } from "@/components/ui/Link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-navy-950 text-warm-50 pt-16 pb-32 md:pt-24 lg:pb-24 px-5 md:px-10 xl:px-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 w-fit py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>
            <img src="/logo-svg/Dark%20BG%20ICON.svg" alt="Vision Wings Logo" className="h-8 w-auto" loading="lazy" decoding="async" />
            <span className="font-display font-bold text-xl text-warm-50">Vision Wings</span>
          </Link>
          <p className="text-body-sm text-navy-300 max-w-xs">
            We give wings to your vision. For growth-stage businesses who feel invisible in a crowded market, Vision Wings is the strategic marketing and growth partner that sees the opportunities competitors miss.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2 lg:col-span-3 lg:grid-cols-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-h4 text-bronze-500 mb-2">EXPERTISE</h4>
            <Link href="/#strategy" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Brand Strategy</Link>
            <Link href="/#strategy" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Visual Identity</Link>
            <Link href="/#strategy" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Growth Marketing</Link>
            <Link href="/#strategy" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Digital Funnels</Link>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-h4 text-bronze-500 mb-2">AGENCY</h4>
            <Link href="/#vision" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>About Us</Link>
            <Link href="/work" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Featured Work</Link>
            <Link href="/videos" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Video Campaigns</Link>
            <Link href="/insights" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Marketing Insights</Link>
            <Link href="/contact" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Contact</Link>
          </div>

          <div className="flex flex-col gap-1 col-span-2 lg:col-span-1">
            <h4 className="text-h4 text-bronze-500 mb-2">CONNECT</h4>
            <a href="mailto:info.visionwings@gmail.com" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>info.visionwings@gmail.com</a>
            <a href="https://www.instagram.com/visionwingsmarketing" target="_blank" rel="noopener noreferrer" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Instagram</a>
            <a href="https://wa.me/918018952359" target="_blank" rel="noopener noreferrer" className="text-body hover:text-bronze-300 transition-colors w-fit py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>WhatsApp: +91 8018952359</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto mt-16 md:mt-24 pt-8 border-t border-navy-700 flex flex-col lg:flex-row justify-between items-center gap-6">
        <p className="text-caption text-navy-300">© {new Date().getFullYear()} Vision Wings Marketing. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-caption">
          <Link href="/privacy" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Privacy Policy</Link>
          <Link href="/terms" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Terms of Service</Link>
          <Link href="/cookies" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Cookie Policy</Link>
          <Link href="/refund-policy" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Refund Policy</Link>
          <Link href="/disclaimer" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Disclaimer</Link>
          <Link href="/copyright" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Copyright Policy</Link>
          <Link href="/accessibility" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Accessibility</Link>
          <Link href="/acceptable-use" className="text-navy-300 hover:text-warm-50 transition-colors py-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-bronze-400 rounded outline-none" data-interactive>Acceptable Use</Link>
        </div>
      </div>
    </footer>
  );
}
