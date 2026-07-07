import { cancel, isCancel, multiselect } from "@clack/prompts"

import { AppError, AppErrorCode } from "@/error"
import { truncateTextByDisplayWidth } from "@/tools/string"
import { RemoteSkillService } from "./remote"

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
