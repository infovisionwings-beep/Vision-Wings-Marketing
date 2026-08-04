'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Briefcase, User, Check, Sparkles, Building2, Globe, Share2, Users, Newspaper, Mic, HelpCircle, CheckCircle2 } from 'lucide-react'
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import { saveOnboardingProfile, checkOnboardingStatus } from '@/app/actions/onboarding'
import { useRouter } from 'next/navigation'
import { Link } from "@/components/ui/Link"

const SERVICES = [
  "Brand Strategy & Architecture",
  "Digital Experience & Web Design",
  "Full-Stack Web Development",
  "Growth Marketing & SEO",
  "Video Production & Motion Graphics",
  "Executive Positioning & PR",
  "Performance PPC & Acquisition",
  "Conversion Rate Optimization (CRO)"
]

const SOURCES = [
  { id: 'google', label: 'Google Search / Organic', icon: Globe },
  { id: 'referral', label: 'Executive Referral / Colleague', icon: Users },
  { id: 'social', label: 'Social Media (Instagram / WhatsApp)', icon: Share2 },
  { id: 'blog', label: 'Industry Essay / Case Study', icon: Newspaper },
  { id: 'podcast', label: 'Podcast / Feature Interview', icon: Mic },
  { id: 'other', label: 'Other Direct Channel', icon: HelpCircle },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verifyStatus() {
      const res = await checkOnboardingStatus()
      if (!res.isAuthenticated) {
        router.push('/login')
      } else if (res.hasProfile) {
        router.push('/')
      }
    }
    verifyStatus()
  }, [router])

  // Form State
  const [type, setType] = useState<'individual' | 'company'>('individual')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Individual fields
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  
  // Company fields
  const [companyName, setCompanyName] = useState('')
  const [employeesCount, setEmployeesCount] = useState('')
  const [fullAddress, setFullAddress] = useState('')

  // Interests (Slide 2)
  const [interests, setInterests] = useState<string[]>([])

  // Source (Slide 3)
  const [source, setSource] = useState('')

  const handleNext = () => {
    if (step === 1) {
      if (!name || !phone) {
        setError("Please provide your full name and verified contact number.")
        return
      }
      if (type === 'company' && (!companyName || !employeesCount || !fullAddress)) {
        setError("Please complete all required company dossier specifications.")
        return
      }
      if (type === 'individual' && (!country || !state || !city || !pincode)) {
        setError("Please provide your complete location coordinates.")
        return
      }
    }
    if (step === 2 && interests.length === 0) {
      setError("Please select at least one strategic service mandate.")
      return
    }
    setError(null)
    setStep(s => Math.min(s + 1, 3))
  }

  const handleBack = () => {
    setError(null)
    setStep(s => Math.max(s - 1, 1))
  }

  const toggleInterest = (service: string) => {
    setError(null)
    setInterests(prev => 
      prev.includes(service)
        ? prev.filter(i => i !== service)
        : [...prev, service]
    )
  }

  const handleSubmit = () => {
    if (!source) {
      setError("Please select your primary attribution channel.")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('type', type)
      formData.append('name', name)
      formData.append('phone', phone)
      formData.append('source', source)
      formData.append('interests', JSON.stringify(interests))

      if (type === 'individual') {
        formData.append('country', country)
        formData.append('state', state)
        formData.append('city', city)
        formData.append('pincode', pincode)
      } else {
        formData.append('companyName', companyName)
        formData.append('employeesCount', employeesCount)
        formData.append('fullAddress', fullAddress)
      }

      const result = await saveOnboardingProfile(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/')
      }
    })
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 py-20 bg-warm-50 font-sans relative overflow-hidden">
      
      {/* Background Atmospheric Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-bronze-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-950/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[720px] relative z-10">
        
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-navy-200/60">
          <Link href="/" className="flex items-center gap-3 group" data-interactive>
            <img src="/logo-svg/Primary%20ICON.svg" alt="VW Logo" className="h-9 w-auto group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none text-navy-950">Vision Wings</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-600 mt-1">Client Dossier Setup</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-navy-950 text-warm-50 rounded-full text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-bronze-400" />
            <span>STEP 0{step} / 03</span>
          </div>
        </div>

        {/* Editorial Progress Stepper */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { num: 1, label: "Entity Profile", sub: "Identity & Contacts" },
            { num: 2, label: "Strategic Mandate", sub: "Service Scope" },
            { num: 3, label: "Attribution Intel", sub: "Source Discovery" }
          ].map(s => {
            const isActive = step === s.num
            const isDone = step > s.num
            return (
              <div 
                key={s.num} 
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive 
                    ? "bg-white border-bronze-500 shadow-sm" 
                    : isDone 
                    ? "bg-navy-950/5 border-navy-200/80" 
                    : "bg-warm-100/50 border-transparent opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isActive ? "text-bronze-600" : isDone ? "text-navy-950" : "text-navy-400"}`}>
                    0{s.num} // STEP
                  </span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                </div>
                <div>
                  <h4 className={`text-caption font-bold ${isActive || isDone ? "text-navy-950" : "text-navy-500"}`}>
                    {s.label}
                  </h4>
                  <p className="text-[10px] text-navy-400 hidden sm:block mt-0.5">{s.sub}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Card Console */}
        <div className="bg-white/95 backdrop-blur-md border border-navy-200/80 p-6 sm:p-12 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.05)] min-h-[500px] flex flex-col justify-between">
          
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={1}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-950 mb-2">Configure Entity Profile</h2>
                    <p className="text-navy-500 font-medium text-body-sm">Specify whether you are onboarding as an individual principal or representing an enterprise brand.</p>
                  </div>

                  {/* Tactile Selection Tiles (Individual vs Company) */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => { setType('individual'); setError(null); }}
                      className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start text-left relative group ${
                        type === 'individual' 
                          ? 'border-bronze-500 bg-bronze-50/40 text-navy-950 shadow-sm' 
                          : 'border-navy-200/80 bg-white hover:border-navy-400 text-navy-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`p-2.5 rounded-lg ${type === 'individual' ? 'bg-bronze-500 text-white' : 'bg-warm-100 text-navy-600'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        {type === 'individual' && <CheckCircle2 className="w-5 h-5 text-bronze-600" />}
                      </div>
                      <span className="font-bold text-base text-navy-950 mb-1">Individual Principal</span>
                      <span className="text-caption text-navy-500 leading-normal">Independent consultant, creator, or standalone executive.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setType('company'); setError(null); }}
                      className={`p-5 rounded-xl border-2 transition-all flex flex-col items-start text-left relative group ${
                        type === 'company' 
                          ? 'border-bronze-500 bg-bronze-50/40 text-navy-950 shadow-sm' 
                          : 'border-navy-200/80 bg-white hover:border-navy-400 text-navy-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`p-2.5 rounded-lg ${type === 'company' ? 'bg-bronze-500 text-white' : 'bg-warm-100 text-navy-600'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        {type === 'company' && <CheckCircle2 className="w-5 h-5 text-bronze-600" />}
                      </div>
                      <span className="font-bold text-base text-navy-950 mb-1">Enterprise Brand</span>
                      <span className="text-caption text-navy-500 leading-normal">Corporation, funded startup, or business partnership.</span>
                    </button>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input 
                        label="Primary Representative Name" 
                        required 
                        placeholder="e.g. Alexander Vance" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                      />
                      <Input 
                        label="Verified Phone (with Country Code)" 
                        required 
                        placeholder="e.g. +1 (555) 019-2831" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>

                    {type === 'individual' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-navy-100">
                        <Input label="Country of Residence" required placeholder="United States" value={country} onChange={e => setCountry(e.target.value)} />
                        <Input label="State / Province" required placeholder="California" value={state} onChange={e => setState(e.target.value)} />
                        <Input label="City / Municipality" required placeholder="San Francisco" value={city} onChange={e => setCity(e.target.value)} />
                        <Input label="Postal / Zip Code" required placeholder="94105" value={pincode} onChange={e => setPincode(e.target.value)} />
                      </div>
                    ) : (
                      <div className="space-y-5 pt-2 border-t border-navy-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Input label="Registered Entity Name" required placeholder="e.g. Lumina Health Systems Inc." value={companyName} onChange={e => setCompanyName(e.target.value)} />
                          
                          <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-navy-700 flex items-center justify-between">
                              <span>Workforce Scale (Employees)</span>
                              <span className="text-[9px] text-bronze-600 font-mono">REQUIRED</span>
                            </label>
                            <select 
                              value={employeesCount} 
                              onChange={e => setEmployeesCount(e.target.value)} 
                              className="w-full px-4 py-3.5 bg-white/90 border border-navy-200/80 rounded-lg text-body text-navy-950 focus:outline-none focus:border-bronze-500 focus:ring-4 focus:ring-bronze-500/15 transition-all font-medium"
                            >
                              <option value="">Select organizational tier...</option>
                              <option value="1-10">1 - 10 Employees (Seed / Boutique)</option>
                              <option value="11-50">11 - 50 Employees (Growth Stage)</option>
                              <option value="51-200">51 - 200 Employees (Mid-Market)</option>
                              <option value="201-500">201 - 500 Employees (Upper Mid-Market)</option>
                              <option value="500+">500+ Employees (Enterprise)</option>
                            </select>
                          </div>
                        </div>

                        <Textarea 
                          label="Complete Corporate Headquarters Address" 
                          required 
                          placeholder="Street Address, Suite / Floor&#10;City, State / Province, Postal Code&#10;Country" 
                          rows={3}
                          value={fullAddress} 
                          onChange={e => setFullAddress(e.target.value)} 
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-950 mb-2">Define Strategic Mandate</h2>
                    <p className="text-navy-500 font-medium text-body-sm">Select all strategic disciplines and execution capabilities required for your upcoming growth cycle.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES.map(service => {
                      const isSelected = interests.includes(service)
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleInterest(service)}
                          className={`p-4 rounded-xl text-left font-medium transition-all flex items-center justify-between gap-3 border-2 ${
                            isSelected 
                              ? 'bg-bronze-500 text-white border-bronze-500 shadow-md scale-[1.01]' 
                              : 'bg-white text-navy-800 border-navy-200/80 hover:border-bronze-400 hover:bg-warm-50/50'
                          }`}
                        >
                          <span className="text-body-sm font-semibold">{service}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-white text-bronze-600' : 'bg-warm-100 text-transparent border border-navy-200'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-950 mb-2">Attribution &amp; Discovery</h2>
                    <p className="text-navy-500 font-medium text-body-sm">Select the primary channel through which you originally discovered or were referred to Vision Wings.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SOURCES.map(s => {
                      const Icon = s.icon
                      const isSelected = source === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setSource(s.id); setError(null); }}
                          className={`p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3.5 border-2 ${
                            isSelected 
                              ? 'bg-navy-950 text-warm-50 border-navy-950 shadow-md' 
                              : 'bg-white text-navy-800 border-navy-200/80 hover:border-navy-400 hover:bg-warm-50/50'
                          }`}
                        >
                          <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-bronze-500 text-white' : 'bg-warm-100 text-navy-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-body-sm font-bold flex-1">{s.label}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-bronze-400 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-600 text-caption font-mono uppercase tracking-wider text-center bg-red-50/80 py-3 px-4 rounded-lg border border-red-200/80 flex items-center justify-center gap-1.5 mt-6"
              >
                <span>⚠</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-navy-200/60 flex justify-between items-center gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="px-5 py-3 text-caption font-mono uppercase tracking-wider font-bold text-navy-600 hover:text-navy-950 transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Previous Mandate Step
              </button>
            ) : (
              <div /> // Spacer
            )}
            
            {step < 3 ? (
              <Button type="button" onClick={handleNext} className="flex items-center gap-2 px-8 shadow-md">
                <span>Continue Mandate</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} isLoading={isPending} className="flex items-center gap-2 px-8 shadow-lg bg-bronze-500 hover:bg-bronze-600">
                <span>Authorize &amp; Execute Setup</span>
                {!isPending && <Check className="w-4 h-4" />}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
