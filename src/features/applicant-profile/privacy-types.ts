import { z } from "zod"
import { ProfileVisibility, OpenToOpportunities } from "@prisma/client"

export const PrivacySettingsSchema = z.object({
  visibility: z.nativeEnum(ProfileVisibility).default("VISIBLE"),
  openToOpportunities: z.nativeEnum(OpenToOpportunities).default("ACTIVE"),
  hideContactDetails: z.coerce.boolean().default(true),
  hideCurrentEmployer: z.coerce.boolean().default(true),
})

export type PrivacySettingsInput = z.infer<typeof PrivacySettingsSchema>
