"use client";

import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form data to an API
    alert("Form submitted! (This is a mock implementation)");
  };

  return (
    <div className="min-h-screen pt-32 pb-24 md:pt-48 bg-warm-100 flex flex-col items-center">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Column: Copy */}
        <motion.div 
          className="flex flex-col text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-h4 text-bronze-900 mb-6 block">LET'S BUILD TOGETHER</span>
          <h1 className="text-display text-navy-950 mb-8">
            Start the Conversation
          </h1>
          <p className="text-body-lg text-navy-700 max-w-xl">
            For growth-stage businesses who feel invisible in a crowded market, Vision Wings is the strategic brand and growth partner that sees the opportunities competitors miss. 
            <br /><br />
            Fill out the form to tell us a bit about your current challenges, and we'll reach out to schedule a discovery call.
          </p>

          <div className="mt-12 pt-12 border-t border-navy-100/50 flex flex-col gap-6">
            <div>
              <span className="text-caption text-bronze-900 block mb-1">EMAIL</span>
              <a href="mailto:hello@visionwing.agency" className="text-body font-medium text-navy-950 hover:text-bronze-500 transition-colors" data-interactive>hello@visionwing.agency</a>
            </div>
            <div>
              <span className="text-caption text-bronze-900 block mb-1">LOCATION</span>
              <p className="text-body font-medium text-navy-950">Varanasi, UP <br/> (Operating Globally)</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div 
          className="bg-warm-50 p-8 md:p-12 border border-navy-100 rounded-sm shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Input 
                id="firstName"
                label="First Name" 
                placeholder="Jane" 
                required 
              />
              <Input 
                id="lastName"
                label="Last Name" 
                placeholder="Doe" 
                required 
              />
            </div>
            
            <Input 
              id="email"
              type="email"
              label="Work Email" 
              placeholder="jane@company.com" 
              required 
            />

            <Input 
              id="company"
              label="Company Name" 
              placeholder="Acme Corp" 
              required 
            />

            <Textarea 
              id="message"
              label="How can we help?" 
              placeholder="Tell us about your project, goals, or current challenges..." 
              required 
            />

            <Button variant="primary" type="submit" className="w-full justify-center mt-4" data-interactive>
              Submit Inquiry
            </Button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
