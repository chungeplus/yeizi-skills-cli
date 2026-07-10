import type { Command } from "commander"
import type { CommandOption, RawRemoveCommandOption, RemoveCommandOption } from "@/types/commands"

import { cancel, intro, isCancel, multiselect, outro } from "@clack/prompts"
import picocolors from "picocolors"

import { AppError, AppErrorCode } from "@/error"
import { LocalPlatformService } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import {
  buildAddedSkillPlatformList,
  buildRemoteSkillListBySkillNameList,
  parseSkillNameList,
  RemoteSkillService,
  removeSkillListFromPlatformList,
} from "@/features/skill"
import { truncateTextByDisplayWidth } from "@/tools/string"
/**
 * 从所有本地平台移除指定技能。
 */
class RemoveCommand {
  public commandName = "remove"

  /**
   * 命令帮助描述。
   */
  public commandDescription = "移除技能。"

  public commandOptionList: CommandOption[] = [
    {
      commandOptionFlag: "--skill <skills>",
      commandOptionDescription: "逗号分隔的技能列表。",
    },
  ]

  /**
   * 交互式多选远端可移除技能名称列表。
   *
   * @returns 技能名列表
   * @throws AppError (AppErrorCode.PROMPT_CANCELLED_CODE) - 用户按 Ctrl+C 取消时
   *
   * @example
   * ```typescript
   * const skillNameList = await this.promptRemoveSkillNameList()   // ["yeizi-demo","yeizi-self"]
   * ```
   */
  private async promptRemoveSkillNameList(): Promise<string[]> {
    const remoteSkillList = await RemoteSkillService.getRemoteSkillList()
    const localPlatformList = await LocalPlatformService.getLocalPlatformList()

    const addedSkillPlatformList = await buildAddedSkillPlatformList(remoteSkillList, localPlatformList)

    const addedSkillList = await buildRemoteSkillListBySkillNameList(Object.keys(addedSkillPlatformList))

    const HINT_MAX_DISPLAY_WIDTH = 80

    const selectedSkillNameList = await multiselect<string>({
      message: "要移除哪些技能？",
      options: addedSkillList.map((skillItem) => {
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

  /**
   * 从所有本地平台移除指定技能。
   *
   * @param removeCommandOption - 命令参数
   */
  public async execute(removeCommandOption: RemoveCommandOption): Promise<void> {
    try {
      intro(picocolors.inverse(" yeizi-skills "))

      await RemoteRepositoryService.initRemoteRepository()

      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform(),
      ])

      const inputSkillNameList = parseSkillNameList(removeCommandOption.rawSkillNameText)

      if (inputSkillNameList.length > 0) {
        await RemoteSkillService.validateSkillNameListExistInRemoteSkillList(inputSkillNameList)
      }

      let selectedSkillNameList: string[] = inputSkillNameList

      if (inputSkillNameList.length === 0) {
        selectedSkillNameList = await this.promptRemoveSkillNameList()
      }

      await removeSkillListFromPlatformList(selectedSkillNameList)

      outro("移除成功！")
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
   * 注册 `remove` 命令。
   *
   * @param program - 根命令对象
   */
  public register(program: Command): void {
    const removeCommand = program.command(this.commandName).description(this.commandDescription)

    this.commandOptionList.forEach((commandOption) => {
      removeCommand.option(
        commandOption.commandOptionFlag,
        commandOption.commandOptionDescription,
      )
    })

    removeCommand.action(async (rawRemoveCommandOption: RawRemoveCommandOption) => {
      const removeCommandOption: RemoveCommandOption = {
        rawSkillNameText: rawRemoveCommandOption.skill,
      }

      await this.execute(removeCommandOption)
    })
  }
}

export { RemoveCommand }
