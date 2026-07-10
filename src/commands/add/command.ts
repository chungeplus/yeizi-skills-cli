import type { Command } from "commander"
import type { AddCommandOption, CommandOption, RawAddCommandOption } from "@/types/commands"
import type { PlatformItem } from "@/types/platform"
import type { SkillItem } from "@/types/skill"

import { cancel, intro, isCancel, multiselect, outro } from "@clack/prompts"
import picocolors from "picocolors"

import { AppError, AppErrorCode } from "@/error"
import { buildPlatformListByPlatformNameList, LocalPlatformService } from "@/features/platform"
import { RemoteRepositoryService } from "@/features/repository"
import {
  addSkillListToPlatformList,
  buildRemoteSkillListBySkillNameList,
  parseSkillNameList,
  RemoteSkillService,
} from "@/features/skill"
import { truncateTextByDisplayWidth } from "@/tools/string"

/**
 * 添加技能到所选平台目录。
 */
class AddCommand {
  public commandName = "add"

  /**
   * 命令帮助描述。
   */
  public commandDescription = "添加技能。"

  /**
   * 命令选项列表。
   */
  public commandOptionList: CommandOption[] = [
    {
      commandOptionFlag: "--skill <skills>",
      commandOptionDescription: "逗号分隔的技能列表。",
    },
  ]

  /**
   * 交互式多选远端可添加技能名称列表。
   *
   * @returns 技能名列表
   * @throws AppError (AppErrorCode.PROMPT_CANCELLED_CODE) - 用户按 Ctrl+C 取消时
   *
   * @example
   * ```typescript
   * const skillNameList = await this.promptAddSkillNameList()   // ["yeizi-demo","yeizi-self"]
   * ```
   */
  private async promptAddSkillNameList(): Promise<string[]> {
    const remoteSkillList = await RemoteSkillService.getRemoteSkillList()

    const HINT_MAX_DISPLAY_WIDTH = 80

    const selectedSkillNameList = await multiselect<string>({
      message: "要添加哪些技能？",
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

  /**
   * 交互式多选目标平台名称列表。
   *
   * @returns 平台名列表
   * @throws AppError (AppErrorCode.PROMPT_CANCELLED_CODE) - 用户按 Ctrl+C 取消时
   *
   * @example
   * ```typescript
   * const platformNameList = await this.promptAddPlatformNameList() // ["codex", "claude"]
   * ```
   */
  private async promptAddPlatformNameList(): Promise<string[]> {
    const localPlatformList = await LocalPlatformService.getLocalPlatformList()

    const selectedPlatformNameList = await multiselect<string>({
      message: "要安装到哪些平台？",
      options: localPlatformList.map(platformItem => ({
        value: platformItem.platformName,
        label: platformItem.platformName,
      })),
      required: true,
    })

    if (isCancel(selectedPlatformNameList)) {
      cancel("已取消操作。")
      throw new AppError(AppErrorCode.PROMPT_CANCELLED_CODE)
    }

    return selectedPlatformNameList
  }

  /**
   * 把所选技能复制到所选平台目录。
   *
   * @param addCommandOption - 命令参数
   */
  public async execute(addCommandOption: AddCommandOption): Promise<void> {
    try {
      intro(picocolors.inverse(" yeizi-skills "))

      await RemoteRepositoryService.initRemoteRepository()

      await Promise.all([
        RemoteSkillService.initRemoteSkill(),
        LocalPlatformService.initLocalPlatform(),
      ])

      const inputSkillNameList = parseSkillNameList(addCommandOption.rawSkillNameText)

      if (inputSkillNameList.length > 0) {
        await RemoteSkillService.validateSkillNameListExistInRemoteSkillList(inputSkillNameList)
      }

      let selectedSkillNameList: string[] = inputSkillNameList

      if (inputSkillNameList.length === 0) {
        selectedSkillNameList = await this.promptAddSkillNameList()
      }

      const selectedPlatformNameList = await this.promptAddPlatformNameList()

      const selectedPlatformList: PlatformItem[] = await buildPlatformListByPlatformNameList(selectedPlatformNameList)

      const selectedSkillList: SkillItem[] = await buildRemoteSkillListBySkillNameList(selectedSkillNameList)

      await addSkillListToPlatformList(selectedSkillList, selectedPlatformList)

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

  /**
   * 注册 `add` 命令。
   *
   * @param program - 根命令对象
   */
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
