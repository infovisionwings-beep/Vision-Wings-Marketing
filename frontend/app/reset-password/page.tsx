'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import Button from "@/components/ui/Button"
import { authClient } from '@/lib/auth/client'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Neon Auth passes the token in the URL when the user clicks the email link
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
    <div className="bg-white border border-navy-100 p-6 sm:p-10 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-display font-bold text-navy-950 mb-3">
          Set New Password
        </h1>
        <p className="text-navy-500 font-medium text-body">
          Choose a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-navy-300 group-focus-within:text-bronze-600 transition-colors" />
            </div>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="New Password (min. 8 characters)"
              className="w-full pl-12 pr-4 py-4 bg-warm-50 border border-navy-100 rounded-sm text-navy-950 placeholder:text-navy-300 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:border-bronze-500 transition-all font-medium text-body"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-600 text-sm font-medium text-center bg-red-50 py-3 px-4 rounded-sm border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          isLoading={isPending}
          className="w-full flex items-center justify-center gap-2"
        >
          Reset Password
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-navy-100 pt-6">
        <a 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </a>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-24 relative overflow-hidden bg-warm-50">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-warm-100 rounded-bl-[100px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-warm-100 rounded-tr-[100px] -z-10 opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <Suspense fallback={<div className="bg-white border border-navy-100 p-10 rounded-sm shadow-sm h-64 flex items-center justify-center text-navy-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  )
}
