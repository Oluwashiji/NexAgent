import { Link } from 'react-router-dom'
import AnimatedSection from '@/components/AnimatedSection'

export default function CTABanner() {
  return (
    <section className="py-16 lg:py-20 gradient-primary">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <AnimatedSection>
          <h2 className="text-2xl lg:text-4xl font-bold text-white leading-tight">
            Ready to never miss a customer question again?
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="mt-4 text-base lg:text-lg text-white/85">
            Join thousands of businesses using NexAgent to deliver instant, accurate support.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <Link
            to="/signup"
            className="inline-block mt-8 px-10 py-4 bg-white text-brand-blue font-semibold rounded-[10px] hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all"
          >
            Get Started for Free
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
