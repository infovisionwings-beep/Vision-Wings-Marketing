'use server'

import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

export async function authenticateWithTurnstile(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string
  const isSignUp = formData.get('isSignUp') === 'true'

  if (!email || !password || !turnstileToken) {
    return { error: "Missing required fields or human verification failed." }
  }

  // 1. Verify Turnstile token
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: turnstileToken,
    }).toString()
  })
  
  const outcome = await res.json()
  if (!outcome.success) {
    return { error: "Security check failed. Please try again." }
  }

  // 2. Authenticate with Neon
  let result;
  if (isSignUp) {
    const name = email.split('@')[0] || 'User'
    result = await auth.signUp.email({ name, email, password })
  } else {
    result = await auth.signIn.email({ email, password })
  }

  if (result?.error) {
    return { error: result.error.message || "Authentication failed. Please check your credentials." }
  }

  // 3. Redirect on success
  redirect('/')
}

export async function logoutUser() {
  await auth.signOut()
  redirect('/')
}
