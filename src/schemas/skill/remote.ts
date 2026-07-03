import type { RawSkillEntryFileObject } from "@/types/skill"
import { z } from "zod"

const skillEntryFileObjectSchema: z.ZodSchema<RawSkillEntryFileObject> = z
  .object({

    name: z.string(),

    description: z.string(),
  })
  .passthrough()

export { skillEntryFileObjectSchema }
