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
