import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  return session.user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/forbidden")
  }
  
  return user
}

export function getDefaultRouteForRole(role: string): string {
  switch (role) {
    case "APPLICANT":
      return "/dashboard"
    case "HOSPITAL_CONTACT":
      return "/hospitals"
    case "ADMIN":
      return "/admin"
    default:
      return "/forbidden"
  }
}
