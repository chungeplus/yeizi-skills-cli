import type { PromptSkillAnswers, SkillName } from "@/types/skill"

import inquirer from "inquirer"
import { AppError, AppErrorCode } from "@/error"
import { RemoteSkillService } from "@/features/skill"

async function promptSkillNameList(): Promise<SkillName[]> {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

  if (remoteSkillList.length === 0) {
    throw new AppError(AppErrorCode.REMOTE_SKILL_EMPTY)
  }

  const choiceList = remoteSkillList.map((skillItem) => {
    let choiceName = skillItem.skillName
    if (skillItem.skillDescription.length > 0) {
      choiceName = `${skillItem.skillName}\n    └ ${skillItem.skillDescription}`
    }

    return {
      name: choiceName,
      value: skillItem.skillName,
    }
  })

  const answers = await inquirer.prompt<PromptSkillAnswers>([
    {
      type: "checkbox",
      name: "selectedSkillNameList",
      message: "请选择要安装的技能。",
      choices: choiceList,
      validate: async (selectedSkillNameList: SkillName[]) => {
        if (selectedSkillNameList.length === 0) {
          return "请至少选择一个技能。"
        }

        return true
      },
    },
  ])

  return answers.selectedSkillNameList
}

export { promptSkillNameList }
