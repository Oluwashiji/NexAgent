import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, CreditCard, Gift, Clock } from 'lucide-react'
import AmbientGlow from '@/components/AmbientGlow'

export default function HeroSection() {
  return (
    <section id="demo" className="relative min-h-screen pt-[72px] overflow-hidden bg-white">
      {/* Ambient Glows */}
      <AmbientGlow color="blue" size={600} className="-top-32 -left-32 opacity-60" />
      <AmbientGlow color="violet" size={500} className="top-1/3 right-0 opacity-50" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
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
                className="px-7 py-3.5 text-sm font-semibold text-white rounded-[10px] gradient-primary shadow-[0_2px_12px_rgba(4,120,87,0.3)] hover:shadow-[0_4px_20px_rgba(4,120,87,0.4)] hover:-translate-y-0.5 transition-all"
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
                { icon: CreditCard, text: 'No credit card required' },
                { icon: Gift, text: 'Free plan, no time limit' },
                { icon: Clock, text: 'Live in under 2 minutes' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-slate-500">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Ambient Background Panel */}
          {/* Placeholder animated gradient for now. To use a real video instead,
              replace the inner <div> below with:
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
              and drop the video file into the /public folder. */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
           <div className="relative w-full max-w-[420px] h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/hero-image.jpg"
                alt="Business owner using NexAgent"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}