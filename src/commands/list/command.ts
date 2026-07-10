import type { Command } from "commander"
import type { CommandOption, ListCommandOption, RawListCommandOption } from "@/types/commands"

import { intro } from "@clack/prompts"
import picocolors from "picocolors"

import { renderTableDisplay } from "@/features/display"
import { LocalPlatformService } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import { buildAddedSkillPlatformList, RemoteSkillService } from "@/features/skill"

/**
 * 展示当前已添加到各本地平台的技能清单。
 */
class ListCommand {
  public commandName = "list"

  /**
   * 命令帮助描述。
   */
  public commandDescription = "查看技能列表。"

  /**
   * 命令选项列表。
   */
  public commandOptionList: CommandOption[] = []

  /**
   * 按技能列表与平台列表生成「技能 → 已添加平台」表格行。
   *
   * @returns 表格行列表（不含表头）
   *
   * @example
   * ```typescript
   * const rowList = await this.buildAddedSkillPlatformTableRowList(skillList, platformList) // [["web", "codex"], ["api", "claude"]]
   * ```
   */
  private async buildAddedSkillPlatformTableRowList(

  ): Promise<string[][]> {
    const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

    const localPlatformList = await LocalPlatformService.getLocalPlatformList()

    const addedSkillPlatformList = await buildAddedSkillPlatformList(remoteSkillList, localPlatformList)

    return addedSkillPlatformList.map(({ skillName, addedPlatformNameList }) => [
      skillName,
      addedPlatformNameList.join(", "),
    ])
  }

  /**
   * 展示已添加到各本地平台的技能清单。
   *
   * @param _listCommandOption - list 命令选项。
   */
  public async execute(_listCommandOption: ListCommandOption): Promise<void> {
    try {
      intro(picocolors.inverse(" yeizi-skills "))

      await RemoteRepositoryService.initRemoteRepository()

      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform(),
      ])

      const addedSkillPlatformTableRowList = await this.buildAddedSkillPlatformTableRowList()

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

  /**
   * 注册 `list` 命令。
   *
   * @param program - 根命令对象
   */
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
