import { AppError, AppErrorCode } from "@/error"
import { rawSkillNameTextSchema } from "@/schemas/skill"
import { splitCsvString } from "@/tools/string"

function parseSkillNameList(rawSkillNameText: string | undefined): string[] {
  if (rawSkillNameText === undefined) {
    return []
  }

  const parsedSkillNameCsvResult = rawSkillNameTextSchema.safeParse(rawSkillNameText)

  if (!parsedSkillNameCsvResult.success) {
    throw new AppError(AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE, {
      param: { rawSkillNameText },
    })
  }

  return splitCsvString(rawSkillNameText)
}

export { parseSkillNameList }
