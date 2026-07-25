"use client";

// Reading this as: Landing page hero for a premium creative marketing agency, with an editorial design vibe, leaning toward large minimalist display type, restrained scroll triggers, and high-fidelity custom motion components.
// DESIGN_VARIANCE: 8
// MOTION_INTENSITY: 6
// VISUAL_DENSITY: 3

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedLogo from "@/components/motion/AnimatedLogo";
import Button from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [isLogoRevealed, setIsLogoRevealed] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const handleSkip = () => setSkipAnimation(true);
    
    // Allow users to skip the initial animation by interacting
    window.addEventListener("scroll", handleSkip, { once: true });
    window.addEventListener("click", handleSkip, { once: true });
    window.addEventListener("touchstart", handleSkip, { once: true });

    return () => {
      window.removeEventListener("scroll", handleSkip);
      window.removeEventListener("click", handleSkip);
      window.removeEventListener("touchstart", handleSkip);
    };
  }, []);

  const handleLogoComplete = () => {
    setIsLogoRevealed(true);
  };

  const showContent = prefersReducedMotion || skipAnimation || isLogoRevealed;

  return (
    <section className="relative min-h-[100dvh] pt-20 pb-16 md:pt-24 lg:pt-24 flex flex-col justify-center bg-warm-50 overflow-hidden">
      {/* ── Layered background for depth ── */}
      {/* Radial copper glow behind the logo area */}
      <div 
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #B87333 0%, transparent 70%)",
        }}
      />

      {/* Top-left subtle navy radial for contrast */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #0F172A 0%, transparent 70%)",
        }}
      />

      {/* Bottom gradient vignette – fades into the next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(15,23,42,0.04))",
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

      <div className="w-full mx-auto px-5 md:px-10 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-[1280px] mx-auto">
          
          <div className="order-last lg:order-first lg:col-span-7 flex flex-col text-center lg:text-left">
            <motion.h1
              className="text-display text-navy-950 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              SEE WHAT OTHERS MISS
            </motion.h1>

            <motion.p
              className="text-body-lg text-navy-700 mb-10 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              For growth-stage businesses who feel invisible in a crowded market, Vision Wings is the strategic brand and growth partner that sees the opportunities competitors miss.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto whitespace-nowrap" data-interactive>Let&apos;s Build Together</Button>
              </Link>
              <Link href="#vision" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto whitespace-nowrap" data-interactive>Explore Our Vision</Button>
              </Link>
            </motion.div>
          </div>

          <div className="order-first lg:order-last lg:col-span-5 flex justify-center items-center">
            <AnimatedLogo
              onComplete={handleLogoComplete}
              isReducedMotion={!!(prefersReducedMotion || skipAnimation)}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
