import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, CreditCard, Gift, Clock } from 'lucide-react'
import ChatWidget from '@/components/ChatWidget'
import AmbientGlow from '@/components/AmbientGlow'

export default function HeroSection() {
  return (
    <section id="demo" className="relative min-h-screen pt-[72px] overflow-hidden bg-[#0A0F1E]">
      {/* Ambient Glows */}
      <AmbientGlow color="blue" size={600} className="-top-32 -left-32 opacity-60" />
      <AmbientGlow color="violet" size={500} className="top-1/3 right-0 opacity-50" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-xs font-medium text-brand-blue">AI-Powered Customer Support</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-slate-50 leading-[1.05] tracking-tight"
            >
              Your business,{' '}
              <span className="text-gradient">always available.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg text-slate-400 max-w-[480px] mx-auto lg:mx-0 leading-relaxed"
            >
              Upload your documents and get a working AI chatbot for your website in under 2 minutes. No coding required.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/signup"
                className="px-7 py-3.5 text-sm font-semibold text-white rounded-[10px] gradient-primary shadow-[0_2px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all"
              >
                Start for Free
              </Link>
              <button className="px-7 py-3.5 text-sm font-semibold text-slate-50 rounded-[10px] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8"
            >
              {[
                { icon: CreditCard, text: 'No credit card' },
                { icon: Gift, text: 'Free forever plan' },
                { icon: Clock, text: 'Setup in 2 min' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-slate-500">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Preview Label */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">Live Preview</span>
              </div>
              <ChatWidget inline className="w-full max-w-[380px] h-[520px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
