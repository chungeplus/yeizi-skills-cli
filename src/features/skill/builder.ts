import type { PlatformList } from "@/types/platform"
import type { SkillItem, SkillList } from "@/types/skill"

import { readdir } from "node:fs/promises"
import { AppError, AppErrorCode } from "@/error"
import { RemoteSkillService } from "./remote"

/**
 * 按技能名列表查对应的 `SkillItem`。
 *
 * @param skillNameList - 技能名列表
 * @returns 技能项列表
 * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE) - 当远端技能子目录不可读时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE) - 当技能条目 frontmatter 不合法时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE) - 当技能子目录下缺少 SKILL.md 时
 * @throws AppError (AppErrorCode.REMOTE_SKILL_EMPTY_CODE) - 当远端仓库中没有任何技能时
 *
 * @example
 * ```typescript
 * const skillList = await buildSkillList(["web", "api"]) // [{ skillName: "web", skillDescription: "前端技能集合" }, { skillName: "api", skillDescription: "接口技能集合" }]
 * ```
 */
async function buildSkillList(skillNameList: string[]): Promise<SkillItem[]> {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList()
  const skillList = skillNameList.map(
    skillName => remoteSkillList.find(remoteSkillItem => remoteSkillItem.skillName === skillName)!,
  )
  return skillList
}

/**
 * 按技能列表与平台列表生成「技能 → 已添加平台」表格行。任一平台都不包含该技能时该技能不出现在结果中。
 *
 * @param skillList - 技能列表
 * @param platformList - 平台列表
 * @returns 表格行列表（不含表头）
 * @throws AppError (AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE) - 当目录读取失败时
 *
 * @example
 * ```typescript
 * const rowList = await buildAddedSkillPlatformTableRowList(skillList, platformList) // [["web", "codex"], ["api", "claude"]]
 * ```
 */
async function buildAddedSkillPlatformTableRowList(
  skillList: SkillList,
  platformList: PlatformList,
): Promise<string[][]> {
  const platformAddedSkillNameEntryList = await Promise.all(
    platformList.map(async ({ platformSkillDirectoryPath, platformName }) => {
      let platformDirectoryEntryList
      try {
        platformDirectoryEntryList = await readdir(platformSkillDirectoryPath, { withFileTypes: true })
      }
      catch (error) {
        if (error instanceof Error) {
          throw new AppError(AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE, {
            param: { platformName, platformSkillDirectoryPath },
          })
        }
        throw error
      }
      const addedSkillNameList = platformDirectoryEntryList
        .filter(directoryEntryItem => directoryEntryItem.isDirectory())
        .map(({ name }) => name)

      return {
        platformName,
        addedSkillNameList,
      }
    }),
  )

  const addedSkillPlatformTableRowList: string[][] = []

  skillList.forEach(({ skillName }) => {
    const addedPlatformNameList = platformAddedSkillNameEntryList
      .filter(({ addedSkillNameList }) => addedSkillNameList.includes(skillName))
      .map(({ platformName }) => platformName)

    if (addedPlatformNameList.length === 0) {
      return
    }

    addedSkillPlatformTableRowList.push([skillName, addedPlatformNameList.join(", ")])
  })

  return addedSkillPlatformTableRowList
}

export {
  buildAddedSkillPlatformTableRowList,
  buildSkillList,
}
