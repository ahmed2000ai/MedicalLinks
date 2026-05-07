import { NextResponse } from "next/server"
import { auth } from "./auth"

const publicRoutes = ["/login", "/register", "/"]
const roleRoutes = {
  APPLICANT: ["/dashboard", "/profile", "/documents", "/applications", "/opportunities", "/messages", "/settings"],
  HOSPITAL_CONTACT: ["/hospitals", "/settings", "/messages"],
  ADMIN: ["/admin", "/components", "/recruiter", "/hospitals", "/messages", "/settings"],
  RECRUITER: ["/admin", "/recruiter", "/hospitals", "/messages", "/settings"] // Aliased to Admin
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as string | undefined

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/")) {
    if (userRole === "APPLICANT") return NextResponse.redirect(new URL("/dashboard", nextUrl))
    if (userRole === "HOSPITAL_CONTACT") return NextResponse.redirect(new URL("/hospitals", nextUrl))
    if (userRole === "ADMIN" || userRole === "RECRUITER") return NextResponse.redirect(new URL("/admin", nextUrl))
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Guard routes based on role
  if (isLoggedIn && !isPublicRoute) {
    const path = nextUrl.pathname
    let allowed = false
    
    if (userRole && roleRoutes[userRole as keyof typeof roleRoutes]) {
      const allowedPaths = roleRoutes[userRole as keyof typeof roleRoutes]
      if (allowedPaths.some(p => path.startsWith(p))) {
        allowed = true
      }
    }

    if (!allowed && path !== "/unauthorized") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
