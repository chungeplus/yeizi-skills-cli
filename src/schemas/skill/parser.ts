import { z } from "zod"

const rawSkillNameTextSchema = z.string().refine(
  (rawSkillNameText) => {
    return rawSkillNameText.split(",").every(csvSegment => csvSegment.trim().length > 0)
  },
  {
    message: "技能名格式错误，多个技能名使用英文逗号分隔，技能名不能为空。",
  },
)

export { rawSkillNameTextSchema }
