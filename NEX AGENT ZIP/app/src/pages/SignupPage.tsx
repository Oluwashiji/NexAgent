import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Quote } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getPasswordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-zA-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name || name.length < 2) newErrors.name = 'Name must be at least 2 characters'
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) newErrors.password = 'Must contain a letter and a number'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!agreed) newErrors.agreed = 'You must agree to the terms'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      navigate('/dashboard')
    }
  }

  const strength = getPasswordStrength(password)
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Brand Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[45%] bg-navy-800 relative flex-col justify-between p-16 overflow-hidden"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(4,120,87,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full gradient-primary" />
          <span className="text-xl font-bold text-slate-50">NexAgent</span>
        </Link>

        <div className="relative z-10">
          <Quote className="w-8 h-8 text-brand-blue/50 mb-4" />
          <p className="text-lg text-slate-50 italic leading-relaxed">
            "We set up our AI support agent in under 2 minutes. Now our customers get instant answers 24/7."
          </p>
          <p className="mt-4 text-sm text-slate-400">— Michael Okafor, Founder of AfriTrade</p>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          Your business, always available.
        </p>
      </motion.div>

      {/* Right Panel - Form Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-y-auto"
      >
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="w-2.5 h-2.5 rounded-full gradient-primary" />
            <span className="text-xl font-bold text-slate-50">NexAgent</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl font-bold text-slate-50">Create your account</h1>
            <p className="mt-2 text-slate-400">Enter your details to get started</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <label className="block text-sm font-medium text-slate-400 mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })) }}
                placeholder="John Smith"
                className={`w-full bg-navy-700 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-[10px] px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all`}
              />
              {errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-red-400">{errors.name}</motion.p>}
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
                placeholder="you@company.com"
                className={`w-full bg-navy-700 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-[10px] px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all`}
              />
              {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-red-400">{errors.email}</motion.p>}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                placeholder="••••••••"
                className={`w-full bg-navy-700 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-[10px] px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all`}
              />
              {/* Strength Indicator */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : 'bg-navy-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{strengthLabels[strength - 1] || ''}</span>
                </div>
              )}
              {errors.password && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-red-400">{errors.password}</motion.p>}
            </motion.div>

            {/* Confirm Password */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium text-slate-400 mb-2">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })) }}
                placeholder="••••••••"
                className={`w-full bg-navy-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-[10px] px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all`}
              />
              {errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-red-400">{errors.confirmPassword}</motion.p>}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => { setAgreed(!agreed); setErrors(prev => ({ ...prev, agreed: '' })) }}
                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                  agreed ? 'bg-brand-blue border-brand-blue' : 'border-white/20'
                }`}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <p className="text-sm text-slate-400">
                I agree to the{' '}
                <span className="text-brand-blue hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-brand-blue hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </motion.div>
            {errors.agreed && <p className="text-xs text-red-400 -mt-3">{errors.agreed}</p>}

            {/* Submit */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              type="submit"
              className="w-full py-3 text-sm font-semibold text-white rounded-[10px] gradient-primary shadow-[0_2px_12px_rgba(4,120,87,0.3)] hover:shadow-[0_4px_20px_rgba(4,120,87,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Create account
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Signup */}
          <button className="w-full py-3 text-sm font-medium text-slate-50 rounded-[10px] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
