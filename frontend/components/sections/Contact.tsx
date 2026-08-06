// Server Component — no state, no handlers, no effects. Its interactive parts
// (RevealOnScroll, Button, Link) are client components rendered as children.

// Reading this as: Final conversion CTA banner for an agency landing page, utilizing bold dark-mode contrast, tactile button physics, film-grain texture, and unified CTA labeling.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { content } from "@/lib/content";

interface ContactProps {
  settings?: Record<string, string>;
}

export default function Contact({ settings }: ContactProps) {
  const email = content(settings, "contact.email");

  return (
    <section id="contact" className="relative py-24 md:py-36 lg:py-48 px-5 md:px-10 xl:px-20 bg-navy-950 text-center overflow-hidden">
      {/* Subtle copper radial glow for atmospheric depth */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #B87333 0%, transparent 70%)",
        }}
      />

      {/* Film-grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 space-y-12">
        <RevealOnScroll className="space-y-6">
          <h2 className="text-h1 font-bold text-warm-50 text-balance">
            {content(settings, "contact.heading")}
          </h2>
          <p className="text-body-lg text-navy-300 max-w-2xl mx-auto leading-relaxed">
            {content(settings, "contact.body")}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <Link href={content(settings, "contact.cta_link")} className="inline-block w-full sm:w-auto">
            <Button 
              variant="primary" 
              className="bg-warm-50 text-navy-950 hover:bg-warm-100 active:bg-warm-200 active:scale-[0.98] active:-translate-y-[1px] transition-all w-full sm:w-auto px-8 py-4 text-base font-bold whitespace-nowrap shadow-xl group" 
              data-interactive
            >
              <span>{content(settings, "contact.cta_text")}</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </RevealOnScroll>

        {/* Credentials & Direct Outreach Footer Strip */}
        <RevealOnScroll delay={0.2} className="pt-12 border-t border-navy-800/80 w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-navy-400">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-bronze-400" />
            <a href={`mailto:${email}`} className="hover:text-warm-50 transition-colors" data-interactive>
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-bronze-400" />
            <span>{content(settings, "contact.location")}</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
