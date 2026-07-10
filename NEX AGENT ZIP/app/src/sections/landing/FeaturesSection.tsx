import { Zap, BookOpen, Clock, Globe, BarChart3, Languages } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'
import AmbientGlow from '@/components/AmbientGlow'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Go from documents to live chatbot in under 2 minutes. No technical skills needed.',
  },
  {
    icon: BookOpen,
    title: 'Trained on Your Content',
    description: 'Your agent learns exclusively from your uploaded documents. Every answer is accurate and on-brand.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a customer question. Your AI agent responds instantly, any time of day or night.',
  },
  {
    icon: Globe,
    title: 'Embed Anywhere',
    description: 'One line of JavaScript works on any website — WordPress, Shopify, React, or plain HTML.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track conversations, see top questions, and understand what your customers care about most.',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Support customers in 50+ languages automatically. Your agent translates on the fly.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 lg:py-32 bg-[#0A0F1E] overflow-hidden">
      {/* Ambient Glow */}
      <AmbientGlow color="violet" size={600} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.1em]">Features</span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-slate-50 max-w-[600px] mx-auto leading-tight">
            Everything you need to support your customers
          </h2>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <AnimatedItem key={feature.title} delay={index * 0.1}>
              <GlassCard className="h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-5 group-hover:bg-brand-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-blue" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  )
}
