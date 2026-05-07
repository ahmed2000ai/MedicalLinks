import { LoginForm } from "./login-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  
  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side: Brand / Image Panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative items-center justify-center overflow-hidden">
        {/* Abstract medical cross or geometric patterns in background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Soft overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/50 to-primary/80 mix-blend-multiply" />

        <div className="relative z-10 p-12 lg:p-24 text-primary-foreground max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold flex items-center gap-2 mb-6">
              <span className="text-white text-5xl lg:text-7xl font-black">+</span> 
              <span>Medical<span className="text-teal-200">Links</span></span>
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-primary-foreground/90 mb-4">
              Connecting world-class medical professionals with premier healthcare opportunities across the GCC.
            </p>
            <p className="text-lg text-primary-foreground/75">
              Secure, efficient, and professional platform access.
            </p>
          </div>

          <div className="flex gap-4 items-center mt-12 text-sm font-medium text-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-300" /> Verify
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-300" /> Match
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-300" /> Place
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50/50">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile branding */}
          <div className="md:hidden mb-10 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <span className="text-primary text-4xl font-black">+</span> 
              <span className="text-slate-900">Medical<span className="text-primary">Links</span></span>
            </h1>
          </div>
          
          <LoginForm />
          
          <p className="mt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MedicalLinks GCC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
