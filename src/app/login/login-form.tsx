"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FeedbackAlert } from "@/components/ui/feedback"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginType, setLoginType] = useState<"APPLICANT" | "HOSPITAL">("APPLICANT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
        setLoading(false)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-xl border-slate-100 bg-white">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
            Sign In
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Enter your credentials to access your secure portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <FeedbackAlert 
              type="error" 
              message={error} 
            />
          )}

          {/* Role Selector Segmented Control */}
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType("APPLICANT")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginType === "APPLICANT" 
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Applicant
            </button>
            <button
              type="button"
              onClick={() => setLoginType("HOSPITAL")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginType === "HOSPITAL" 
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Hospital
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-slate-700" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input 
                id="email" 
                type="email" 
                placeholder={loginType === "APPLICANT" ? "doctor@example.com" : "hospital@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 border-slate-200 focus-visible:ring-primary/30"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none text-slate-700" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 border-slate-200 focus-visible:ring-primary/30"
                disabled={loading}
              />
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-4">
          <Button 
            type="submit" 
            className="w-full text-base font-medium h-11" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          {loginType === "APPLICANT" && (
            <div className="text-center text-sm text-slate-500">
              New applicant?{" "}
              <a href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Create an account
              </a>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
