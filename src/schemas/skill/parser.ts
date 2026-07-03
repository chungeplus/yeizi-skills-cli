import { z } from "zod"

const rawSkillNameTextSchema = z.string().refine(
  (csvValue) => {
    return csvValue.split(",").every(item => item.trim().length > 0)
  },
)

export { rawSkillNameTextSchema }
