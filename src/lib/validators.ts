import { z } from "zod";

export const quickApplySchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  whatsapp: z.string().optional(),
  currentCountry: z.string().min(2, "Current country is required"),
  nationality: z.string().min(2, "Nationality is required"),
  specialty: z.string().min(2, "Specialty is required"),
  currentGrade: z.string().min(2, "Current grade is required"),
  yearsOfExperience: z.number().min(0, "Years of experience must be 0 or more"),
  preferredGccCountries: z.array(z.string()).min(1, "Select at least one preferred country"),
  consent: z.boolean().refine(val => val === true, "You must consent to proceed"),
});

export type QuickApplyFormValues = z.infer<typeof quickApplySchema>;
