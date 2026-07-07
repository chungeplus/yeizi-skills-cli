import type { Command } from "commander"
import type { AddCommandOption, CommandOption, RawAddCommandOption } from "@/types/commands"
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

class AddCommand {
  public commandName = "add"

  public commandDescription = "添加技能。"

  public commandOptionList: CommandOption[] = [
    {
      commandOptionFlag: "--skill <skills>",
      commandOptionDescription: "逗号分隔的技能列表。",
    },
  ]

  public async execute(addCommandOption: AddCommandOption): Promise<void> {
    try {
      intro(picocolors.inverse(" yeizi-skills "))

      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform(),
      ])

      const inputSkillNameList = parseSkillNameList(addCommandOption.rawSkillNameText)

      await RemoteSkillService.validateSkillNameListExistInRemoteSkillList(inputSkillNameList)

      let selectedSkillNameList: string[] = inputSkillNameList

      if (inputSkillNameList.length === 0) {
        selectedSkillNameList = await promptSkillNameList()
      }

      const selectedPlatformNameList = await promptPlatformNameList()

      const selectedPlatformList: PlatformItem[] = await buildPlatformList(selectedPlatformNameList)

      const selectedSkillList: SkillItem[] = await buildSkillList(selectedSkillNameList)

      await copySkillListToPlatformList(selectedSkillList, selectedPlatformList)

      outro("添加成功！")
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
    const addCommand = program.command(this.commandName).description(this.commandDescription)

    this.commandOptionList.forEach((commandOption) => {
      addCommand.option(
        commandOption.commandOptionFlag,
        commandOption.commandOptionDescription,
      )
    })

    addCommand.action(async (rawAddCommandOption: RawAddCommandOption) => {
      const addCommandOption: AddCommandOption = {
        rawSkillNameText: rawAddCommandOption.skill,
      }

      await this.execute(addCommandOption)
    })
  }
}

export { AddCommand }
