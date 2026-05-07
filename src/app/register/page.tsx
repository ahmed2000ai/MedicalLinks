import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ApplicantRegistrationForm } from "./registration-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Applicant Account — MedicalLinks",
  description: "Join MedicalLinks and be discovered by leading hospitals across the GCC.",
}

export default async function RegisterPage() {
  const session = await auth()
  if (session?.user) redirect("/")

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left: Brand Panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/50 to-primary/80 mix-blend-multiply" />

        <div className="relative z-10 p-12 lg:p-16 text-primary-foreground max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-2 mb-6">
              <span className="text-white text-5xl lg:text-6xl font-black">+</span>
              <span>Medical<span className="text-teal-200">Links</span></span>
            </h1>
            <p className="text-xl font-medium leading-relaxed text-primary-foreground/90 mb-4">
              Your career in GCC healthcare starts here.
            </p>
            <p className="text-base text-primary-foreground/75">
              Create your profile and be discovered by leading hospitals across Saudi Arabia, UAE, Qatar, and beyond.
            </p>
          </div>

          <div className="space-y-3 mt-10">
            {[
              "AI-assisted profile setup from your CV",
              "Verified opportunities from screened hospitals",
              "Privacy controls — you decide who sees your data",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 text-sm text-teal-100">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-300 mt-1.5 shrink-0" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-16 bg-slate-50/50">
        <div className="w-full max-w-lg mx-auto">
          {/* Mobile branding */}
          <div className="md:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <span className="text-primary text-3xl font-black">+</span>
              Medical<span className="text-primary">Links</span>
            </h1>
          </div>

          <ApplicantRegistrationForm />

          <p className="mt-6 text-center text-xs text-slate-400">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
