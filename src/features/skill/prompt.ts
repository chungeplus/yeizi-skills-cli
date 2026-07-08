import { cancel, isCancel, multiselect } from "@clack/prompts"

import { AppError, AppErrorCode } from "@/error"
import { truncateTextByDisplayWidth } from "@/tools/string"
import { RemoteSkillService } from "./remote"

/**
 * 交互式多选目标技能名称列表。
 *
 * @returns 技能名列表
 * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE) - 当远端技能子目录不可读时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE) - 当技能条目 frontmatter 不合法时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE) - 当技能子目录下缺少 SKILL.md 时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_EMPTY_CODE) - 当远端仓库中没有任何技能时
 * @throws AppError (AppErrorCode.PROMPT_CANCELLED_CODE) - 用户按 Ctrl+C 取消时
 *
 * @example
 * ```typescript
 * const skillNameList = await promptSkillNameList() // ["web", "api"]
 * ```
 */
async function promptSkillNameList(): Promise<string[]> {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

  const HINT_MAX_DISPLAY_WIDTH = 80

  const selectedSkillNameList = await multiselect<string>({
    message: "要安装哪些技能？",
    options: remoteSkillList.map((skillItem) => {
      const truncatedSkillDescriptionHint = truncateTextByDisplayWidth(
        skillItem.skillDescription,
        HINT_MAX_DISPLAY_WIDTH,
      )

      return {
        value: skillItem.skillName,
        label: skillItem.skillName,
        hint: truncatedSkillDescriptionHint,
      }
    }),
    required: true,
  })

  if (isCancel(selectedSkillNameList)) {
    cancel("已取消操作。")
    throw new AppError(AppErrorCode.PROMPT_CANCELLED_CODE)
  }

  return selectedSkillNameList
}

export { promptSkillNameList }
