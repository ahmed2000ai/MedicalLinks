import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"

interface LandingNavbarProps {
  isAuthenticated: boolean
  dashboardRoute: string
}

export function LandingNavbar({ isAuthenticated, dashboardRoute }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#041a3a]">
            MedicalLinks
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
            For Doctors <ChevronDown size={14} className="opacity-50" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
            For Hospitals <ChevronDown size={14} className="opacity-50" />
          </div>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="#about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href={dashboardRoute}>
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
