import type { PlatformItem } from "@/types/platform"
import type { SkillComparisonRow, SkillComparisonStateType, SkillItem } from "@/types/skill"

import { readdir } from "node:fs/promises"

import { SkillComparisonState } from "@/constants/skill"
import { RemoteSkillService } from "@/features/skill"

async function buildSkillList(skillNameList: string[]): Promise<SkillItem[]> {
  const remoteSkillList = await RemoteSkillService.getRemoteSkillList()
  const skillList = skillNameList.map(
    skillName => remoteSkillList.find(remoteSkillItem => remoteSkillItem.skillName === skillName)!,
  )
  return skillList
}

async function buildInstallMessageList(
  skillList: SkillItem[],
  platformList: PlatformItem[],
): Promise<string[]> {
  const installMessageList: string[] = []

  for (const platformItem of platformList) {
    installMessageList.push(
      `已安装 ${skillList.map(skillItem => skillItem.skillName).join(", ")} 到 ${platformItem.platformName}`,
    )
  }

  return installMessageList
}

async function buildLocalPlatformRemoteSkillComparisonRowList(
  remoteSkillList: SkillItem[],
  localPlatformList: PlatformItem[],
): Promise<SkillComparisonRow[]> {
  const localPlatformRemoteSkillComparisonRowList: SkillComparisonRow[] = []
  const remoteSkillNameSet = new Set(remoteSkillList.map(remoteSkillItem => remoteSkillItem.skillName))

  for (const localPlatformItem of localPlatformList) {
    const localPlatformDirectoryEntryList = await readdir(localPlatformItem.platformSkillDirectoryPath, { withFileTypes: true })

    const localPlatformSkillNameSet = new Set(
      localPlatformDirectoryEntryList
        .filter(directoryEntryItem => directoryEntryItem.isDirectory())
        .map(directoryEntryItem => directoryEntryItem.name),
    )

    for (const remoteSkillItem of remoteSkillList) {
      let localPlatformRemoteSkillComparisonState: SkillComparisonStateType = SkillComparisonState.NOT_INSTALLED

      if (localPlatformSkillNameSet.has(remoteSkillItem.skillName)) {
        localPlatformRemoteSkillComparisonState = SkillComparisonState.INSTALLED
      }

      localPlatformRemoteSkillComparisonRowList.push({
        platformName: localPlatformItem.platformName,
        skillName: remoteSkillItem.skillName,
        skillComparisonState: localPlatformRemoteSkillComparisonState,
      })
    }

    const localPlatformRemoteRemovedSkillNameList = Array.from(localPlatformSkillNameSet).filter(
      localSkillName => !remoteSkillNameSet.has(localSkillName),
    )

    localPlatformRemoteRemovedSkillNameList.forEach((localPlatformRemoteRemovedSkillName) => {
      localPlatformRemoteSkillComparisonRowList.push({
        platformName: localPlatformItem.platformName,
        skillName: localPlatformRemoteRemovedSkillName,
        skillComparisonState: SkillComparisonState.REMOTE_REMOVED,
      })
    })
  }

  return localPlatformRemoteSkillComparisonRowList
}

export { buildInstallMessageList, buildLocalPlatformRemoteSkillComparisonRowList, buildSkillList }
