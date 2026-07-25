"use client";

import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { Sparkles, ArrowRight, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inquiry successfully transmitted! A senior brand strategist will review your dossier within 24 hours.");
  };

  return (
    <div className="min-h-screen pt-32 pb-24 md:pt-48 bg-warm-50 flex flex-col items-center relative overflow-hidden font-sans">
      
      {/* Atmospheric Background Glow */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-bronze-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-navy-950/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
        
        {/* Left Column: Editorial Strategy Copy (5 cols) */}
        <motion.div 
          className="flex flex-col text-left lg:col-span-5 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-bronze-600 bg-bronze-50 border border-bronze-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-bronze-500" />
              <span>DISCOVERY PROTOCOL</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-display font-bold text-navy-950 tracking-tight leading-[1.08] mb-6">
            Initiate Strategic <br />
            <span className="text-bronze-600 font-normal italic">Partnership.</span>
          </h1>
          
          <p className="text-body-lg text-navy-600 leading-relaxed font-light mb-10 max-w-xl">
            For growth-stage enterprises and executive founders who refuse to blend into crowded markets. Tell us about your current growth bottlenecks, and our senior strategists will schedule a confidential discovery session.
          </p>

          {/* Contact Telemetry Box */}
          <div className="p-6 rounded-2xl bg-white/80 border border-navy-200/80 shadow-sm flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-navy-950 text-warm-50 shrink-0 mt-0.5 shadow-sm">
                <Mail className="w-5 h-5 text-bronze-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-navy-400 block mb-1">EXECUTIVE DISPATCH</span>
                <a href="mailto:hello@visionwing.agency" className="text-body font-bold text-navy-950 hover:text-bronze-600 transition-colors" data-interactive>hello@visionwing.agency</a>
                <p className="text-caption text-navy-500 mt-0.5">Encrypted direct transmission</p>
              </div>
            </div>

            <div className="pt-5 border-t border-navy-100 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-navy-950 text-warm-50 shrink-0 mt-0.5 shadow-sm">
                <MapPin className="w-5 h-5 text-bronze-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-navy-400 block mb-1">GLOBAL HEADQUARTERS</span>
                <p className="text-body font-bold text-navy-950">Varanasi, UP — India</p>
                <p className="text-caption text-navy-500 mt-0.5">Operating across global time zones (EST / GMT / IST)</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-caption font-mono text-navy-500">
            <ShieldCheck className="w-4 h-4 text-bronze-600" />
            <span>All client inquiries are bound by strict NDA protocols.</span>
          </div>
        </motion.div>

        {/* Right Column: Tactile Form Console (7 cols) */}
        <motion.div 
          className="lg:col-span-7 bg-white/95 backdrop-blur-md p-8 md:p-12 border border-navy-200/80 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 pb-6 border-b border-navy-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-navy-950">Client Discovery Dossier</h3>
              <p className="text-caption text-navy-500 mt-0.5">Please provide accurate organizational coordinates.</p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-600 bg-bronze-50 px-3 py-1 rounded-md border border-bronze-200">
              SECURE FORM
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                id="firstName"
                label="First Name" 
                placeholder="e.g. Jane" 
                required 
              />
              <Input 
                id="lastName"
                label="Last Name" 
                placeholder="e.g. Doe" 
                required 
              />
            </div>
            
            <Input 
              id="email"
              type="email"
              label="Work Email Address" 
              placeholder="e.g. jane@company.com" 
              required 
              helperText="We will never share or syndicate your corporate contact intel"
            />

            <Input 
              id="company"
              label="Enterprise / Organization Name" 
              placeholder="e.g. Acme Health Systems Inc." 
              required 
            />

            <Textarea 
              id="message"
              label="Strategic Growth Mandate & Objectives" 
              placeholder="Detail your current market positioning bottlenecks, upcoming product launches, or target conversion metrics..." 
              required 
              rows={4}
            />

            <div className="pt-2">
              <Button variant="primary" type="submit" className="w-full justify-center gap-2 shadow-md hover:shadow-lg" data-interactive>
                <span>Transmit Strategic Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
