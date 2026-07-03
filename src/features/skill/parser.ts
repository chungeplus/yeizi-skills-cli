import type { SkillName } from "@/types/skill"

import { AppError, AppErrorCode } from "@/error"
import { rawSkillNameTextSchema } from "@/schemas/skill/parser"
import { splitCsvString } from "@/tools/string"

function parseSkillNameList(rawSkillNameText: string | undefined): SkillName[] {
  if (rawSkillNameText === undefined) {
    return []
  }

  const parsedSkillNameCsvResult = rawSkillNameTextSchema.safeParse(rawSkillNameText)

  if (!parsedSkillNameCsvResult.success) {
    throw new AppError(AppErrorCode.SKILL_OPTION_INVALID_FORMAT, {
      param: { rawSkillNameText },
    })
  }

  return splitCsvString(rawSkillNameText)
}

export { parseSkillNameList }
