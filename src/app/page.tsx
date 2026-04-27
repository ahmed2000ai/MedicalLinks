import { auth } from "@/auth"
import { getDefaultRouteForRole } from "@/lib/auth-guards"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { TrustStrip } from "@/components/landing/TrustStrip"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { AudienceSection } from "@/components/landing/AudienceSection"
import { FeaturedOpportunitiesSection } from "@/components/landing/FeaturedOpportunitiesSection"
import { TestimonialSection } from "@/components/landing/TestimonialSection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default async function Home() {
  const session = await auth()
  const isAuthenticated = !!session?.user
  const dashboardRoute = isAuthenticated && session?.user?.role 
    ? getDefaultRouteForRole(session.user.role) 
    : "/login"

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar isAuthenticated={isAuthenticated} dashboardRoute={dashboardRoute} />
      <main>
        <HeroSection />
        <TrustStrip />
        <HowItWorksSection />
        <AudienceSection />
        <FeaturedOpportunitiesSection />
        <TestimonialSection />
      </main>
      <LandingFooter />
    </div>
  )
}
