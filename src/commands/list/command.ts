import type { Command } from "commander"
import type { CommandOption, ListCommandOption, RawListCommandOption } from "@/types/commands"

import { renderTableDisplay } from "@/features/display"
import { LocalPlatformService } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import {
  buildInstalledSkillPlatformTableRowList,
  RemoteSkillService,
} from "@/features/skill"

class ListCommand {
  public readonly commandName = "list"

  public readonly commandDescription = "查看技能列表。"

  public readonly commandOptionList: readonly CommandOption[] = []

  public async execute(_listCommandOption: ListCommandOption): Promise<void> {
    try {
      await RemoteSkillService.initRemoteSkill()

      await RemoteRepositoryService.initRemoteRepository()

      await LocalPlatformService.initLocalPlatform()

      const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

      const localPlatformList = await LocalPlatformService.getLocalPlatformList()

      const installedSkillPlatformTableRowList = await buildInstalledSkillPlatformTableRowList(
        remoteSkillList,
        localPlatformList,
      )

      renderTableDisplay("已安装技能列表", installedSkillPlatformTableRowList)
    }
    finally {
      await RemoteSkillService.resetRemoteSkill()

      await RemoteRepositoryService.resetRemoteRepository()

      await LocalPlatformService.resetLocalPlatform()
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
