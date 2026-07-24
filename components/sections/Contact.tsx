"use client";

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Button from "@/components/ui/Button";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 lg:py-40 px-5 md:px-10 xl:px-20 bg-navy-950 text-center overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <RevealOnScroll>
          <span className="text-h4 text-bronze-500 block mb-6">GET IN TOUCH</span>
          <h2 className="text-display text-warm-50 mb-8 leading-tight">
            Ready to claim your unfair advantage?
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-body-lg text-navy-300 mb-12">
            Let's discuss how Vision Wings can help clarify your brand, elevate your design, and accelerate your growth.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <div className="w-full flex justify-center">
            <Button variant="primary" className="bg-warm-50 text-navy-950 hover:bg-warm-100 active:bg-warm-200 w-full md:w-auto" data-interactive>
              Start the Conversation
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
