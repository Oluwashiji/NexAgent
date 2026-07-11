import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/sections/landing/HeroSection'
import HowItWorksSection from '@/sections/landing/HowItWorksSection'
import FeaturesSection from '@/sections/landing/FeaturesSection'
import PricingSection from '@/sections/landing/PricingSection'
import CTABanner from '@/sections/landing/CTABanner'
import ChatWidget from '@/components/ChatWidget'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <CTABanner />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
