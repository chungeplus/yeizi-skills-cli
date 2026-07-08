import { AppError, AppErrorCode } from "@/error"
import { rawSkillNameTextSchema } from "@/schemas/skill"
import { splitCsvString } from "@/tools/string"

/**
 * 解析 `--skill` 选项技能名列表。
 *
 * @param rawSkillNameText - `--skill` 选项原始文本。
 * @returns 技能名列表
 * @throws AppError (AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE) - 当输入格式不合法时
 *
 * @example
 * ```typescript
 * const skillNameList = parseSkillNameList("a,b,c") // ["a", "b", "c"]
 * const emptySkillNameList = parseSkillNameList(undefined) // []
 * ```
 */
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
