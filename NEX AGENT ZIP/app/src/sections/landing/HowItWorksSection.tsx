import { Upload, Bot, Code } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

const STEPS = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload your docs',
    description: 'Upload PDFs, Word docs, or paste text. Our AI processes and understands your content instantly.',
  },
  {
    number: '02',
    icon: Bot,
    title: 'Create your agent',
    description: "Configure your agent's personality, greeting message, and fallback responses in seconds.",
  },
  {
    number: '03',
    icon: Code,
    title: 'Embed on your site',
    description: 'Copy a single line of code and paste it into your website. Your chatbot goes live immediately.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.1em]">How It Works</span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-slate-50 max-w-[600px] mx-auto leading-tight">
            Get your AI agent running in 3 simple steps
          </h2>
        </AnimatedSection>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, index) => (
            <AnimatedItem key={step.number} delay={index * 0.1}>
              <GlassCard className="relative h-full">
                {/* Step Number Watermark */}
                <span className="absolute top-4 right-4 text-6xl lg:text-7xl font-extrabold text-brand-blue/[0.08] select-none">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-50 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </GlassCard>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  )
}
