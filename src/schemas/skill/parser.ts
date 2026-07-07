import { z } from "zod"

const rawSkillNameTextSchema = z.string().refine(
  (rawSkillNameText) => {
    return rawSkillNameText.split(",").every(csvSegment => csvSegment.trim().length > 0)
  },
)

export { rawSkillNameTextSchema }
