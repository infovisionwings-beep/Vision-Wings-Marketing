'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, LockKeyhole, KeyRound, CheckCircle2 } from 'lucide-react'
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Link } from "@/components/ui/Link"
import { authClient } from '@/lib/auth/client'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get('password') as string
    
    if (!token) {
      setError("Missing reset token. Please request a new password reset link.")
      setIsPending(false)
      return
    }

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token
      })
      
      if (resetError) {
        setError(resetError.message || "Failed to reset password. The link might be expired.")
      } else {
        router.push('/login')
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border border-navy-200/80 p-6 sm:p-10 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy-950 mb-2">
          Rotate Cryptographic Key
        </h1>
        <p className="text-navy-500 font-medium text-body-sm">
          Establish a new high-entropy password to secure your executive portal dossier.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-[28px] left-0 pl-4 flex items-center pointer-events-none z-10">
              <KeyRound className="h-5 w-5 text-navy-400 group-focus-within:text-bronze-600 transition-colors" />
            </div>
            <Input
              name="password"
              type="password"
              required
              minLength={8}
              label="New Cryptographic Key"
              placeholder="••••••••••••"
              className="pl-12 font-mono"
              helperText="Must contain at least 8 alphanumeric characters"
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
          isLoading={isPending}
          className="w-full justify-center gap-2"
        >
          <span>Confirm Key Rotation</span>
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-navy-100 pt-6">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-caption font-mono uppercase tracking-wider text-navy-500 hover:text-navy-950 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Abort &amp; Return to Gateway</span>
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-warm-50 font-sans">
      {/* Left Pane: Executive Security Pillar */}
      <div className="lg:col-span-5 bg-navy-950 text-warm-50 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden hidden lg:flex border-r border-navy-800 shadow-2xl z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-bronze-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-navy-800/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center gap-3 group" data-interactive>
            <div className="p-2 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center group-hover:border-bronze-500 transition-colors shadow-inner">
              <img src="/logo-svg/Dark%20BG%20ICON.svg" alt="VW Logo" className="h-7 w-auto group-hover:scale-105 transition-transform" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-warm-50">Vision Wings</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-500 bg-navy-900/80 px-2.5 py-1 rounded border border-navy-800">
            KEY ROTATION
          </span>
        </div>

        <div className="my-auto py-12 relative z-10 max-w-md">
          <div className="w-10 h-1 bg-bronze-500 mb-8" />
          <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-warm-50 mb-6">
            Cryptographic Security &amp; <br />
            <span className="text-bronze-400 font-normal italic">Access Governance.</span>
          </h2>
          <p className="text-body text-navy-200 leading-relaxed font-light mb-8">
            Rotating your cryptographic key invalidates all previous sessions and tokens across the Vision Wings cloud infrastructure.
          </p>
        </div>

        <div className="pt-8 border-t border-navy-800/80 grid grid-cols-2 gap-4 relative z-10 text-[11px] font-mono uppercase tracking-wider text-navy-300">
          <div className="flex flex-col gap-1">
            <span className="text-bronze-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Hash
            </span>
            <span className="text-[9px] text-navy-400">Zero-Plaintext Storage</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-navy-800/80 pl-4">
            <span className="text-bronze-400 font-bold flex items-center gap-1.5">
              <LockKeyhole className="w-3.5 h-3.5" /> Instant Revoc
            </span>
            <span className="text-[9px] text-navy-400">Previous Token Expiry</span>
          </div>
        </div>
      </div>

      {/* Right Pane: Reset Console */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-warm-100 rounded-bl-[120px] -z-10 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-warm-100 rounded-tr-[120px] -z-10 opacity-60 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] relative z-10 my-auto py-8"
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5" data-interactive>
              <img src="/logo-svg/Primary%20ICON.svg" alt="VW Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl text-navy-950">Vision Wings</span>
            </Link>
            <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-600 bg-warm-100 px-2.5 py-1 rounded">
              ROTATE KEY
            </span>
          </div>

          <Suspense fallback={<div className="bg-white/95 border border-navy-200/80 p-10 rounded-2xl shadow-sm h-64 flex items-center justify-center text-navy-500 font-mono text-caption uppercase">Decrypting Token...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  )
}
