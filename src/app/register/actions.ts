"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  currentCountry: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof RegisterSchema>

export async function registerApplicant(formData: RegisterInput): Promise<{ success: true } | { error: string }> {
  const result = RegisterSchema.safeParse(formData)
  if (!result.success) {
    const firstError = result.error.issues[0]
    return { error: firstError.message }
  }

  const { firstName, lastName, email, phone, password } = result.data

  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "An account with this email already exists. Please sign in instead." }
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      passwordHash,
      role: "APPLICANT",
      // Create an empty applicant profile and preferences shell so the wizard loads cleanly
      applicantProfile: {
        create: {
          nationality: result.data.nationality || null,
          countryOfResidence: result.data.currentCountry || null,
          preferences: {
            create: {}
          }
        }
      }
    }
  })

  return { success: true }
}
