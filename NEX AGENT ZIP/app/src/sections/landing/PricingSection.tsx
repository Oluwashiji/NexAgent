import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for testing and small projects',
    features: [
      '1 AI agent',
      '100 conversations/month',
      'Basic analytics',
      'Standard response time',
      'Community support',
    ],
    cta: 'Get Started',
    ctaStyle: 'secondary' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses with active customers',
    features: [
      '5 AI agents',
      'Unlimited conversations',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'Multi-language support',
    ],
    cta: 'Start Pro Trial',
    ctaStyle: 'primary' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams that need scale and control',
    features: [
      'Unlimited AI agents',
      'Unlimited conversations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'secondary' as const,
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-navy-800">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.1em]">Pricing</span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-slate-50 leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-[500px] mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, index) => (
            <AnimatedItem key={plan.name} delay={index * 0.1} className={plan.popular ? 'md:-translate-y-2' : ''}>
              <GlassCard
                className={`relative h-full ${plan.popular ? 'border-t-2 border-t-brand-blue' : ''}`}
                padding="xl"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-[10px] font-semibold text-white rounded-full gradient-primary">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-50">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline justify-center gap-0.5">
                    <span className="text-5xl font-bold text-slate-50">{plan.price}</span>
                    {plan.period && <span className="text-sm text-slate-400">{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/signup"
                  className={`block w-full text-center py-3 rounded-[10px] text-sm font-semibold transition-all ${
                    plan.ctaStyle === 'primary'
                      ? 'gradient-primary text-white shadow-[0_2px_12px_rgba(4,120,87,0.3)] hover:shadow-[0_4px_20px_rgba(4,120,87,0.4)] hover:-translate-y-0.5'
                      : 'border border-white/10 text-slate-50 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </GlassCard>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  )
}
