'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Turnstile } from '@marsidev/react-turnstile'
import { authenticateWithTurnstile, verifySignupOtp } from '@/app/actions/auth'
import { Mail, Lock, ArrowRight, KeyRound, ShieldCheck, Zap, LockKeyhole, Eye, CheckCircle2 } from 'lucide-react'
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Link } from "@/components/ui/Link"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isOtpPending, startOtpTransition] = useTransition()
  const [showOtp, setShowOtp] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  // Where to return after sign-in (e.g. an admin invite link that sent an
  // unauthenticated visitor here). Read from the URL rather than useSearchParams so
  // this page needs no Suspense boundary; the server action re-validates it anyway.
  const [next, setNext] = useState("")
  useEffect(() => {
    setNext(new URLSearchParams(window.location.search).get('next') || "")
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.append('isSignUp', isSignUp.toString())
    if (next) formData.append('next', next)

    startTransition(async () => {
      const result = await authenticateWithTurnstile(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.append('email', registeredEmail)
    
    startOtpTransition(async () => {
      const result = await verifySignupOtp(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-warm-50 font-sans">
      
      {/* Left Pane: Executive Brand & Security Pillar (50% on large screens) */}
      <div className="lg:col-span-5 bg-navy-950 text-warm-50 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden hidden lg:flex border-r border-navy-800 shadow-2xl z-10">
        
        {/* Background Atmospheric Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-bronze-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-navy-800/30 rounded-full blur-2xl pointer-events-none" />

        {/* Top Brand Bar */}
        <div className="flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center gap-3 group" data-interactive>
            <div className="p-2 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center group-hover:border-bronze-500 transition-colors shadow-inner">
              <img src="/logo-svg/Dark%20BG%20ICON.svg" alt="VW Logo" className="h-7 w-auto group-hover:scale-105 transition-transform" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-warm-50">Vision Wings</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-500 bg-navy-900/80 px-2.5 py-1 rounded border border-navy-800">
            SECURE GATEWAY
          </span>
        </div>

        {/* Center Editorial Manifesto */}
        <div className="my-auto py-12 relative z-10 max-w-md">
          <div className="w-10 h-1 bg-bronze-500 mb-8" />
          <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-warm-50 mb-6">
            Strategic Clarity. <br />
            <span className="text-bronze-400 font-normal italic">Execution Excellence.</span>
          </h2>
          <p className="text-body text-navy-200 leading-relaxed font-light mb-8">
            Access your executive client dossier, track real-time campaign telemetry, and collaborate directly with senior brand strategists.
          </p>

          {/* Testimonial Quote */}
          <div className="p-5 rounded-xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm">
            <p className="text-body-sm italic text-navy-100 mb-3">
              "Vision Wings restructured our market positioning in 60 days. The portal gives us complete transparency into every strategic milestone."
            </p>
            <div className="flex items-center gap-2 text-caption font-mono text-bronze-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED CLIENT DOSSIER</span>
            </div>
          </div>
        </div>

        {/* Bottom Plain-Layout Security Pillars */}
        <div className="pt-8 border-t border-navy-800/80 grid grid-cols-3 gap-4 relative z-10 text-[11px] font-mono uppercase tracking-wider text-navy-300">
          <div className="flex flex-col gap-1">
            <span className="text-bronze-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> AES-256
            </span>
            <span className="text-[9px] text-navy-400">Encrypted Transport</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-navy-800/80 pl-4">
            <span className="text-bronze-400 font-bold flex items-center gap-1.5">
              <LockKeyhole className="w-3.5 h-3.5" /> Zero-Knowledge
            </span>
            <span className="text-[9px] text-navy-400">Credential Architecture</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-navy-800/80 pl-4">
            <span className="text-bronze-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Portal v2.4
            </span>
            <span className="text-[9px] text-navy-400">Live Telemetry</span>
          </div>
        </div>

      </div>

      {/* Right Pane: Tactile Authentication Console (70% on large screens) */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        
        {/* Subtle Background Elements for Right Pane */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-warm-100 rounded-bl-[120px] -z-10 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-warm-100 rounded-tr-[120px] -z-10 opacity-60 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] relative z-10 my-auto py-8"
        >
          {/* Mobile Brand Header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5" data-interactive>
              <img src="/logo-svg/Primary%20ICON.svg" alt="VW Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl text-navy-950">Vision Wings</span>
            </Link>
            <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-600 bg-warm-100 px-2.5 py-1 rounded">
              PORTAL
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-md border border-navy-200/80 p-6 sm:p-10 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            
            {/* Header Title & Switcher */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy-950 mb-2">
                {showOtp ? 'Verification Required' : (isSignUp ? 'Initiate Partnership' : 'Executive Gateway')}
              </h1>
              <p className="text-navy-500 font-medium text-body-sm">
                {showOtp 
                  ? `Enter the 6-digit cryptographic code sent to ${registeredEmail}`
                  : (isSignUp ? 'Create your strategic dossier credentials' : 'Authenticate to access your active agency portal')}
              </p>

              {/* Tactile Tab Switcher (Only show when not in OTP mode) */}
              {!showOtp && (
                <div className="mt-6 p-1.5 bg-warm-100/80 rounded-xl flex items-center border border-navy-200/60">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setError(null); }}
                    className={`flex-1 py-2.5 min-h-[44px] text-caption font-mono font-semibold uppercase tracking-wider rounded-lg transition-all relative ${
                      !isSignUp ? "text-navy-950 font-bold" : "text-navy-500 hover:text-navy-950"
                    }`}
                  >
                    {!isSignUp && (
                      <motion.div 
                        layoutId="auth-tab" 
                        className="absolute inset-0 bg-white rounded-lg shadow-sm border border-navy-200/60" 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setError(null); }}
                    className={`flex-1 py-2.5 min-h-[44px] text-caption font-mono font-semibold uppercase tracking-wider rounded-lg transition-all relative ${
                      isSignUp ? "text-navy-950 font-bold" : "text-navy-500 hover:text-navy-950"
                    }`}
                  >
                    {isSignUp && (
                      <motion.div 
                        layoutId="auth-tab" 
                        className="absolute inset-0 bg-white rounded-lg shadow-sm border border-navy-200/60" 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">Create Account</span>
                  </button>
                </div>
              )}
            </div>

            {showOtp ? (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <KeyRound className="h-5 w-5 text-navy-400 group-focus-within:text-bronze-600 transition-colors" />
                    </div>
                    <Input
                      name="otp"
                      type="text"
                      required
                      placeholder="• • • • • •"
                      className="pl-12 text-center font-mono text-lg tracking-[0.3em] font-bold"
                      label="One-Time Code"
                      helperText="Check your email inbox or spam folder"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-600 text-caption font-mono uppercase tracking-wider text-center bg-red-50/80 py-3 px-4 rounded-lg border border-red-200/80 flex items-center justify-center gap-1.5"
                    >
                      <span>⚠</span> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  isLoading={isOtpPending}
                  className="w-full justify-center gap-2 min-h-[44px]"
                >
                  Verify Credentials
                  {!isOtpPending && <ArrowRight className="w-4 h-4" />}
                </Button>
                
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => { setShowOtp(false); setError(null); }}
                    className="text-caption font-mono uppercase tracking-wider text-navy-500 hover:text-navy-950 transition-colors"
                  >
                    ← Return to Authentication
                  </button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-[28px] left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-navy-400 group-focus-within:text-bronze-600 transition-colors" />
                      </div>
                      <Input
                        name="email"
                        type="email"
                        required
                        label="Work Email Address"
                        placeholder="name@company.com"
                        className="pl-12"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-[28px] left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-navy-400 group-focus-within:text-bronze-600 transition-colors" />
                      </div>
                      <Input
                        name="password"
                        type="password"
                        required
                        label="Cryptographic Password"
                        placeholder="••••••••"
                        className="pl-12"
                        helperText={isSignUp ? "Minimum 8 characters required" : undefined}
                      />
                    </div>
                  </div>

                  {!isSignUp && (
                    <div className="flex justify-end pt-1">
                      <Link 
                        href="/forgot-password" 
                        className="text-caption font-mono uppercase tracking-wider text-navy-500 hover:text-bronze-600 transition-colors hover:underline"
                        data-interactive
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  )}

                  <div className="flex justify-center py-2 w-full">
                    <Turnstile 
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
                      options={{
                        theme: 'light',
                        size: 'flexible',
                      }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-600 text-caption font-mono uppercase tracking-wider text-center bg-red-50/80 py-3 px-4 rounded-lg border border-red-200/80 flex items-center justify-center gap-1.5"
                      >
                        <span>⚠</span> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    isLoading={isPending}
                    className="w-full justify-center gap-2.5 mt-2 min-h-[44px]"
                  >
                    <span>{isSignUp ? 'Initiate Account Dossier' : 'Enter Executive Portal'}</span>
                    {!isPending && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>

                {/* Footer Assurance */}
                <div className="mt-8 text-center border-t border-navy-100 pt-6 flex flex-col gap-2">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-navy-400">
                    Protected by Cloudflare Enterprise WAF &amp; Turnstile
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
