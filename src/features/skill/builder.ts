import type { PlatformList } from "@/types/platform"
import type { SkillItem, SkillList } from "@/types/skill"

import { readdir } from "node:fs/promises"
import { AppError, AppErrorCode } from "@/error"
import { RemoteSkillService } from "./remote"

async function buildSkillList(skillNameList: string[]): Promise<SkillItem[]> {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList()
  const skillList = skillNameList.map(
    skillName => remoteSkillList.find(remoteSkillItem => remoteSkillItem.skillName === skillName)!,
  )
  return skillList
}

async function buildInstalledSkillPlatformTableRowList(
  skillList: SkillList,
  platformList: PlatformList,
): Promise<string[][]> {
  const platformInstalledSkillNameEntryList = await Promise.all(
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
      const installedSkillNameList = platformDirectoryEntryList
        .filter(directoryEntryItem => directoryEntryItem.isDirectory())
        .map(({ name }) => name)

      return {
        platformName,
        installedSkillNameList,
      }
    }),
  )

  const installedSkillPlatformTableRowList: string[][] = []

  skillList.forEach(({ skillName }) => {
    const installedPlatformNameList = platformInstalledSkillNameEntryList
      .filter(({ installedSkillNameList }) => installedSkillNameList.includes(skillName))
      .map(({ platformName }) => platformName)

    if (installedPlatformNameList.length === 0) {
      return
    }

    installedSkillPlatformTableRowList.push([skillName, installedPlatformNameList.join(", ")])
  })

  return installedSkillPlatformTableRowList
}

export {
  buildInstalledSkillPlatformTableRowList,
  buildSkillList,
}
