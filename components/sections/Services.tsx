"use client";

import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/components/ui/Link";

const services = [
  {
    id: "strategy",
    title: "Brand Strategy",
    description: "Positioning, messaging, and market analysis to uncover your unfair advantage.",
  },
  {
    id: "identity",
    title: "Visual Identity",
    description: "Logos, color systems, typography, and brand guidelines that command authority.",
  },
  {
    id: "digital",
    title: "Digital Experience",
    description: "High-performance websites and applications engineered for conversion and delight.",
  },
  {
    id: "growth",
    title: "Growth Marketing",
    description: "Data-driven campaigns, SEO, and content strategies that scale your revenue.",
  },
];

export default function Services() {
  return (
    <section id="strategy" className="py-16 md:py-24 lg:py-32 px-5 md:px-10 xl:px-20 bg-navy-950 text-warm-50">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 lg:mb-24 gap-6 md:gap-8">
          <RevealOnScroll>
            <span className="text-h4 text-bronze-500 block mb-3 md:mb-4">EXPERTISE</span>
            <h2 className="text-h2 text-warm-50 max-w-2xl">
              Specialized expertise for complex challenges
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-body text-navy-300 max-w-sm">
              We offer a concentrated suite of services designed to move the needle for ambitious brands.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-700 border border-navy-700">
          {services.map((service, index) => (
            <RevealOnScroll
              key={service.id}
              delay={index * 0.1}
              className="h-full"
            >
              <Link
                href={`#${service.id}`}
                className="group relative flex flex-col justify-between h-full bg-navy-950 p-6 md:p-8 lg:p-16 hover:bg-navy-900 transition-colors duration-300 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-500"
                aria-label={`Learn more about ${service.title}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-8 md:mb-12">
                    <span className="text-h4 text-bronze-500">0{index + 1}</span>
                    <span className="p-3 bg-navy-900 rounded-full group-hover:bg-bronze-500 group-hover:text-warm-50 transition-colors duration-300 text-warm-50 inline-flex items-center justify-center w-11 h-11">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                  <h3 className="text-h3 text-warm-50 mb-4">{service.title}</h3>
                  <p className="text-body text-navy-300 max-w-md">{service.description}</p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}


