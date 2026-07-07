import type { Command } from "commander"
import type { CommandOption, InstallCommandOption, RawInstallCommandOption } from "@/types/commands"
import type { PlatformItem } from "@/types/platform"
import type { SkillItem } from "@/types/skill"

import { intro, outro } from "@clack/prompts"
import picocolors from "picocolors"

import { buildPlatformList, LocalPlatformService, promptPlatformNameList } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import {
  buildSkillList,
  copySkillListToPlatformList,
  parseSkillNameList,
  promptSkillNameList,
  RemoteSkillService,
} from "@/features/skill"

class InstallCommand {
  public commandName = "install"

  public commandDescription = "安装技能。"

  public commandOptionList: CommandOption[] = [
    {
      commandOptionFlag: "--skill <skills>",
      commandOptionDescription: "逗号分隔的技能列表。",
    },
  ]

  public async execute(installCommandOption: InstallCommandOption): Promise<void> {
    try {
      intro(picocolors.inverse(" yeizi-skills "))

      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform(),
      ])

      const inputSkillNameList = parseSkillNameList(installCommandOption.rawSkillNameText)

      await RemoteSkillService.validateSkillNameListExistInRemoteSkillList(inputSkillNameList)

      let selectedSkillNameList: string[] = inputSkillNameList

      if (inputSkillNameList.length === 0) {
        selectedSkillNameList = await promptSkillNameList()
      }

      const selectedPlatformNameList = await promptPlatformNameList()

      const selectedPlatformList: PlatformItem[] = await buildPlatformList(selectedPlatformNameList)

      const selectedSkillList: SkillItem[] = await buildSkillList(selectedSkillNameList)

      await copySkillListToPlatformList(selectedSkillList, selectedPlatformList)

      outro("安装成功！")
    }
    finally {
      await Promise.allSettled([
        RemoteSkillService.clearRemoteSkill(),
        RemoteRepositoryService.clearRemoteRepository(),
        LocalPlatformService.clearLocalPlatform(),
      ])
    }
  }

  public register(program: Command): void {
    const installCommand = program.command(this.commandName).description(this.commandDescription)

    this.commandOptionList.forEach((commandOption) => {
      installCommand.option(
        commandOption.commandOptionFlag,
        commandOption.commandOptionDescription,
      )
    })

    installCommand.action(async (rawInstallCommandOption: RawInstallCommandOption) => {
      const installCommandOption: InstallCommandOption = {
        rawSkillNameText: rawInstallCommandOption.skill,
      }

      await this.execute(installCommandOption)
    })
  }
}

export { InstallCommand }
