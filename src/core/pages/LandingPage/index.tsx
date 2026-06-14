import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import Conditions from './components/Conditions'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Conditions />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
