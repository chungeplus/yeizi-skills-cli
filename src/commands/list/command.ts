import type { Command } from "commander"
import type { CommandOption, ListCommandOption, RawListCommandOption } from "@/types/commands"

import type { SkillComparisonRow } from "@/types/skill"

import { SkillComparisonState } from "@/constants/skill"
import { renderTableDisplay } from "@/features/display"
import { buildPlatformList, LocalPlatformService, promptPlatformNameList } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import { buildLocalPlatformRemoteSkillComparisonRowList, RemoteSkillService } from "@/features/skill"

class ListCommand {
  public readonly commandName = "list"

  public readonly commandDescription = "查看技能列表。"

  public readonly commandOptionList: readonly CommandOption[] = []

  private renderLocalPlatformRemoteSkillComparisonTable(
    title: string,
    localPlatformRemoteSkillComparisonRowList: SkillComparisonRow[],
  ): void {
    const skillComparisonStateTextMap = new Map([
      [SkillComparisonState.INSTALLED, "已安装"],
      [SkillComparisonState.NOT_INSTALLED, "未安装"],
      [SkillComparisonState.REMOTE_REMOVED, "远端已移除"],
    ])

    const headerTextList = ["平台", "技能", "状态"]

    const tableContentDataList = localPlatformRemoteSkillComparisonRowList.map(
      (localPlatformRemoteSkillComparisonRowItem) => {
        const skillComparisonStateText = skillComparisonStateTextMap.get(
          localPlatformRemoteSkillComparisonRowItem.skillComparisonState,
        )!

        return [
          localPlatformRemoteSkillComparisonRowItem.platformName,
          localPlatformRemoteSkillComparisonRowItem.skillName,
          skillComparisonStateText,
        ]
      },
    )

    renderTableDisplay(title, headerTextList, tableContentDataList)
  }

  public async execute(_listCommandOption: ListCommandOption): Promise<void> {
    try {
      await RemoteSkillService.initRemoteSkill()

      await RemoteRepositoryService.initRemoteRepository()

      await LocalPlatformService.initLocalPlatform()

      const selectedPlatformNameList = await promptPlatformNameList()

      const selectedPlatformList = await buildPlatformList(selectedPlatformNameList)

      const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

      const localPlatformRemoteSkillComparisonRowList = await buildLocalPlatformRemoteSkillComparisonRowList(
        remoteSkillList,
        selectedPlatformList,
      )

      this.renderLocalPlatformRemoteSkillComparisonTable(
        "本地平台技能列表",
        localPlatformRemoteSkillComparisonRowList,
      )
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
