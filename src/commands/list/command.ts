import type { Command } from "commander"
import type { CommandOption, ListCommandOption, RawListCommandOption } from "@/types/commands"

import { intro } from "@clack/prompts"
import picocolors from "picocolors"

import { renderTableDisplay } from "@/features/display"
import { LocalPlatformService } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import {
  buildAddedSkillPlatformTableRowList,
  RemoteSkillService,
} from "@/features/skill"

class ListCommand {
  public commandName = "list"

  public commandDescription = "查看技能列表。"

  public commandOptionList: CommandOption[] = []

  public async execute(_listCommandOption: ListCommandOption): Promise<void> {
    try {
      intro(picocolors.inverse(" yeizi-skills "))

      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform(),
      ])

      const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

      const localPlatformList = await LocalPlatformService.getLocalPlatformList()

      const addedSkillPlatformTableRowList = await buildAddedSkillPlatformTableRowList(
        remoteSkillList,
        localPlatformList,
      )

      renderTableDisplay("已添加技能列表：", addedSkillPlatformTableRowList)
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
    const listCommand = program.command(this.commandName).description(this.commandDescription)

    this.commandOptionList.forEach((commandOption) => {
      listCommand.option(commandOption.commandOptionFlag, commandOption.commandOptionDescription)
    })

    listCommand.action(async (_rawListCommandOption: RawListCommandOption) => {
      const listCommandOption: ListCommandOption = {}

      await this.execute(listCommandOption)
    })
  }
}

export { ListCommand }
