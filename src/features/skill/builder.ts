import type { PlatformList } from "@/types/platform"
import type { SkillItem, SkillList } from "@/types/skill"

import { readdir } from "node:fs/promises"
import { RemoteSkillService } from "@/features/skill"

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
      const platformDirectoryEntryList = await readdir(platformSkillDirectoryPath, { withFileTypes: true })
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
