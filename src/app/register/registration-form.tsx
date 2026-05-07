"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FeedbackAlert } from "@/components/ui/feedback"
import { registerApplicant } from "./actions"
import { User, Mail, Lock, Phone, Globe, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export function ApplicantRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    currentCountry: "",
    password: "",
    confirmPassword: "",
  })

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await registerApplicant(form)

    if ("error" in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Auto sign-in after registration then redirect to onboarding
    const signInResult = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    })

    if (signInResult?.error) {
      setError("Account created but sign-in failed. Please go to the login page.")
      setLoading(false)
      return
    }

    router.push("/profile")
  }

  return (
    <Card className="w-full shadow-xl border-slate-100 bg-white">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
            Create Applicant Account
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Start your profile to be discovered by leading GCC hospitals.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && <FeedbackAlert type="error" message={error} />}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="firstName"
                  placeholder="Ahmed"
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                  className="pl-10 border-slate-200"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                placeholder="Al-Rashidi"
                value={form.lastName}
                onChange={set("lastName")}
                required
                className="border-slate-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="reg-email">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="reg-email"
                type="email"
                placeholder="doctor@example.com"
                value={form.email}
                onChange={set("email")}
                required
                className="pl-10 border-slate-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="phone">
              Phone <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="+971 50 123 4567"
                value={form.phone}
                onChange={set("phone")}
                className="pl-10 border-slate-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Nationality / Country row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="nationality">
                Nationality <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Globe className="h-4 w-4" />
                </div>
                <Input
                  id="nationality"
                  placeholder="e.g. Egyptian"
                  value={form.nationality}
                  onChange={set("nationality")}
                  className="pl-10 border-slate-200"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="currentCountry">
                Current Country <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>
              <Input
                id="currentCountry"
                placeholder="e.g. United Kingdom"
                value={form.currentCountry}
                onChange={set("currentCountry")}
                className="border-slate-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="reg-password">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="reg-password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                required
                className="pl-10 border-slate-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                required
                className="pl-10 border-slate-200"
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-4">
          <Button type="submit" className="w-full text-base font-medium h-11 gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Start Your Profile <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
