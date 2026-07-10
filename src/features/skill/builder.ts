import type { PlatformList } from "@/types/platform"
import type { SkillItem, SkillList, SkillPlatformItem } from "@/types/skill"

import { readdir } from "node:fs/promises"
import { AppError, AppErrorCode } from "@/error"
import { RemoteSkillService } from "./remote"

/**
 * 按技能名列表解析远端对应的 `SkillItem`。
 *
 * @param skillNameList - 技能名列表
 * @returns 技能项列表
 * @throws AppError (AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE) - 当任一技能名不在远端列表中时
 *
 * @example
 * ```typescript
 * const remoteSkillList = await buildRemoteSkillListBySkillNameList(["web", "api"]) // [{ skillName: "web", skillDescription: "前端技能集合" }, ...]
 * ```
 */
async function buildRemoteSkillListBySkillNameList(skillNameList: string[]): Promise<SkillItem[]> {
  const remoteSkillList: SkillList = await RemoteSkillService.getRemoteSkillList()

  const skillList: SkillItem[] = []
  const notFoundSkillNameList: string[] = []

  skillNameList.forEach((skillName) => {
    const matchedSkillItem = remoteSkillList.find(skillItem => skillItem.skillName === skillName)

    if (matchedSkillItem !== undefined) {
      skillList.push(matchedSkillItem)
      return
    }

    notFoundSkillNameList.push(skillName)
  })

  if (notFoundSkillNameList.length > 0) {
    throw new AppError(AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE, {
      param: {
        skillNameList: notFoundSkillNameList,
      },
    })
  }

  return skillList
}

/**
 * 按技能列表与平台列表生成已添加到至少一个平台的「技能 → 已添加平台」列表。
 *
 * @param skillList - 技能列表
 * @param platformList - 平台列表
 * @returns 已添加的技能-平台列表
 *
 * @example
 * ```typescript
 * const addedSkillPlatformList = await buildAddedSkillPlatformList(skillList, platformList)
 * // [{ skillName: "web", addedPlatformNameList: ["cursor", "windsurf"] }, { skillName: "api", addedPlatformNameList: ["cursor"] }]
 * ```
 */
async function buildAddedSkillPlatformList(
  skillList: SkillList,
  platformList: PlatformList,
): Promise<SkillPlatformItem[]> {
  const skillPlatformNameMap: Record<string, string[]> = {}

  await Promise.all(
    platformList.map(async ({ platformSkillDirectoryPath, platformName }) => {
      let directoryEntryList
      try {
        directoryEntryList = await readdir(platformSkillDirectoryPath, { withFileTypes: true })
      }
      catch (error) {
        if (error instanceof Error) {
          throw new AppError(AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE, {
            param: { platformName, platformSkillDirectoryPath },
          })
        }
        throw error
      }

      const addedSkillNameList = directoryEntryList
        .filter(directoryEntryItem => directoryEntryItem.isDirectory())
        .map(({ name }) => name)
        .filter(directoryName => skillList.some(skillItem => skillItem.skillName === directoryName))

      addedSkillNameList.forEach((skillName) => {
        if (skillPlatformNameMap[skillName] === undefined) {
          skillPlatformNameMap[skillName] = []
        }
        skillPlatformNameMap[skillName].push(platformName)
      })
    }),
  )

  return skillList
    .map(({ skillName }) => ({
      skillName,
      addedPlatformNameList: skillPlatformNameMap[skillName] ?? [],
    }))
    .filter(({ addedPlatformNameList }) => addedPlatformNameList.length > 0)
}

export {
  buildAddedSkillPlatformList,
  buildRemoteSkillListBySkillNameList,
}
