'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Briefcase, User, Check } from 'lucide-react'
import Button from "@/components/ui/Button"
import { saveOnboardingProfile } from '@/app/actions/onboarding'
import { useRouter } from 'next/navigation'

const SERVICES = [
  "Social Media Marketing",
  "SEO Optimization", 
  "Content Creation",
  "PPC Advertising",
  "Email Marketing",
  "Web Design & Development",
  "Brand Strategy",
  "Public Relations",
  "Video Production",
  "Influencer Marketing"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

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
    // Basic validation for step 1
    if (step === 1) {
      if (!name || !phone) {
        setError("Please fill in your name and phone number.")
        return
      }
      if (type === 'company' && (!companyName || !employeesCount || !fullAddress)) {
        setError("Please fill in all company details.")
        return
      }
      if (type === 'individual' && (!country || !state || !city || !pincode)) {
        setError("Please fill in your complete address.")
        return
      }
    }
    setError(null)
    setStep(s => Math.min(s + 1, 3))
  }

  const handleBack = () => {
    setError(null)
    setStep(s => Math.max(s - 1, 1))
  }

  const toggleInterest = (service: string) => {
    setInterests(prev => 
      prev.includes(service)
        ? prev.filter(i => i !== service)
        : [...prev, service]
    )
  }

  const handleSubmit = () => {
    if (!source) {
      setError("Please let us know where you heard about us.")
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
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-warm-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-warm-100 rounded-bl-[100px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-warm-100 rounded-tr-[100px] -z-10 opacity-50" />

      <div className="w-full max-w-[600px] relative z-10">
        
        {/* Progress bar */}
        <div className="mb-8 flex justify-between items-center px-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex items-center">
              <div className={`h-2 flex-1 rounded-full transition-colors duration-300 ${step >= i ? 'bg-bronze-500' : 'bg-navy-100'}`} />
              {i < 3 && <div className="w-2" />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-navy-100 p-6 sm:p-10 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[450px] flex flex-col">
          
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
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-navy-950 mb-2">Let's build your profile</h2>
                    <p className="text-navy-500 font-medium">Tell us a bit about yourself to get started.</p>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setType('individual')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${type === 'individual' ? 'border-bronze-500 bg-bronze-50 text-bronze-700' : 'border-navy-100 bg-white text-navy-500 hover:border-navy-300'}`}
                    >
                      <User className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Individual</span>
                    </button>
                    <button
                      onClick={() => setType('company')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${type === 'company' ? 'border-bronze-500 bg-bronze-50 text-bronze-700' : 'border-navy-100 bg-white text-navy-500 hover:border-navy-300'}`}
                    >
                      <Briefcase className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Company</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="John Doe" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">Phone Number (with Country Code)</label>
                      <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="+1 234 567 8900" />
                    </div>

                    {type === 'individual' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-navy-700 mb-1">Country</label>
                          <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="United States" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-1">State</label>
                          <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="CA" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-1">City</label>
                          <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="San Francisco" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-navy-700 mb-1">Pincode / Zip</label>
                          <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="94105" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-1">Company Name</label>
                          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950" placeholder="Acme Inc." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-1">Number of Employees</label>
                          <select value={employeesCount} onChange={e => setEmployeesCount(e.target.value)} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950">
                            <option value="">Select size...</option>
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="51-200">51-200</option>
                            <option value="201-500">201-500</option>
                            <option value="500+">500+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-700 mb-1">Full Company Address</label>
                          <textarea value={fullAddress} onChange={e => setFullAddress(e.target.value)} rows={3} className="w-full px-4 py-3 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950 resize-none" placeholder="123 Business Rd, Suite 100&#10;City, State, Zip&#10;Country" />
                        </div>
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
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-navy-950 mb-2">What interests you?</h2>
                    <p className="text-navy-500 font-medium">Select all the marketing services you're looking for.</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {SERVICES.map(service => {
                      const isSelected = interests.includes(service)
                      return (
                        <button
                          key={service}
                          onClick={() => toggleInterest(service)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${
                            isSelected 
                              ? 'bg-bronze-500 text-white border-bronze-500' 
                              : 'bg-warm-50 text-navy-600 border-navy-200 hover:border-bronze-300'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                          {service}
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
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-navy-950 mb-2">How did you hear about us?</h2>
                    <p className="text-navy-500 font-medium">We'd love to know where you found us.</p>
                  </div>

                  <div>
                    <select 
                      value={source} 
                      onChange={e => setSource(e.target.value)} 
                      className="w-full px-4 py-4 bg-warm-50 border border-navy-100 rounded-sm focus:outline-none focus:border-bronze-500 text-navy-950 text-lg"
                    >
                      <option value="">Please select an option...</option>
                      <option value="google">Google Search</option>
                      <option value="social">Social Media</option>
                      <option value="referral">Friend or Colleague</option>
                      <option value="blog">Blog or Article</option>
                      <option value="podcast">Podcast</option>
                      <option value="other">Other</option>
                    </select>
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
                className="text-red-600 text-sm font-medium text-center bg-red-50 py-3 px-4 rounded-sm border border-red-100 mt-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-navy-100 flex justify-between items-center gap-4">
            {step > 1 ? (
              <button
                onClick={handleBack}
                disabled={isPending}
                className="px-6 py-3 text-navy-500 font-medium hover:text-navy-950 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div /> // Spacer
            )}
            
            {step < 3 ? (
              <Button onClick={handleNext} className="flex items-center gap-2 px-8">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isPending} className="flex items-center gap-2 px-8">
                Complete Setup
                {!isPending && <Check className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
