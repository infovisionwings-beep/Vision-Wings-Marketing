'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Turnstile } from '@marsidev/react-turnstile'
import { authenticateWithTurnstile } from '@/app/actions/auth'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import Button from "@/components/ui/Button"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.append('isSignUp', isSignUp.toString())
    
    startTransition(async () => {
      const result = await authenticateWithTurnstile(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-24 relative overflow-hidden bg-warm-50">
      
      {/* Subtle background element matching the agency's elegant aesthetic */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-warm-100 rounded-bl-[100px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-warm-100 rounded-tr-[100px] -z-10 opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white border border-navy-100 p-6 sm:p-10 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-display font-bold text-navy-950 mb-3">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-navy-500 font-medium text-body">
              {isSignUp ? 'Enter your details to get started' : 'Sign in to continue to your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-navy-300 group-focus-within:text-bronze-600 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-warm-50 border border-navy-100 rounded-sm text-navy-950 placeholder:text-navy-300 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:border-bronze-500 transition-all font-medium text-body"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-navy-300 group-focus-within:text-bronze-600 transition-colors" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-warm-50 border border-navy-100 rounded-sm text-navy-950 placeholder:text-navy-300 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:border-bronze-500 transition-all font-medium text-body"
                />
              </div>
            </div>

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
              {isSignUp ? 'Sign Up' : 'Sign In'}
              {!isPending && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-navy-100 pt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-sm font-medium text-navy-500 hover:text-navy-950 transition-colors"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-bronze-600 hover:underline">Sign in</span></>
              ) : (
                <>Don't have an account? <span className="text-bronze-600 hover:underline">Sign up</span></>
              )}
            </button>
            
            {!isSignUp && (
              <a 
                href="/forgot-password" 
                className="text-sm font-medium text-navy-500 hover:text-bronze-600 transition-colors hover:underline"
              >
                Forgot your password?
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
