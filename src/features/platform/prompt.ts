import type { PlatformName, PromptPlatformAnswers } from "@/types/platform"

import inquirer from "inquirer"

import { LocalPlatformService } from "@/features/platform"

async function promptPlatformNameList(): Promise<PlatformName[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const answers = await inquirer.prompt<PromptPlatformAnswers>([
    {
      type: "checkbox",
      name: "selectedPlatformNameList",
      message: "请选择的技能平台。",
      choices: [...localPlatformList.map(platformItem => platformItem.platformName)],
      validate: async (selectedPlatformNameList: PlatformName[]) => {
        if (selectedPlatformNameList.length > 0) {
          return true
        }

        return "请至少选择一个平台。"
      },
    },
  ])

  return answers.selectedPlatformNameList
}

export { promptPlatformNameList }
