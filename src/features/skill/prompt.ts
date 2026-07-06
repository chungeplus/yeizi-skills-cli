import type { SkillName } from "@/types/skill"

import { cancel, isCancel, multiselect } from "@clack/prompts"
import stringWidth from "string-width"

import { AppError, AppErrorCode } from "@/error"
import { RemoteSkillService } from "@/features/skill"

async function promptSkillNameList(): Promise<SkillName[]> {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

  const HINT_MAX_DISPLAY_WIDTH = 80

  const selectedSkillNameList = await multiselect<SkillName>({
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

function truncateTextByDisplayWidth(sourceText: string, maxDisplayWidth: number): string {
  const ellipsisText = "…"
  const ellipsisDisplayWidth = stringWidth(ellipsisText)
  const sourceTextMaxDisplayWidth = maxDisplayWidth - ellipsisDisplayWidth
  const sourceTextCodePointList = Array.from(sourceText)
  let currentDisplayWidth = 0
  const truncatedCodePointIndex = sourceTextCodePointList.findIndex((codePoint) => {
    currentDisplayWidth += stringWidth(codePoint)
    return currentDisplayWidth > sourceTextMaxDisplayWidth
  })
  if (truncatedCodePointIndex === -1) {
    return sourceText
  }
  return sourceTextCodePointList.slice(0, truncatedCodePointIndex).join("") + ellipsisText
}

export { promptSkillNameList }
