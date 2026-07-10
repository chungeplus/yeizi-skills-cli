import type { PlatformItem } from "@/types/platform"

import { resolve } from "node:path"

import { AppError, AppErrorCode } from "@/error"
import { LocalPlatformService } from "@/features/platform"
import { removeDirectory } from "@/tools/filesystem"

/**
 * 把每个技能从每个本地平台的技能目录中移除。对应平台中不存在该技能目录时静默跳过。
 *
 * @param skillNameList - 技能名列表
 *
 * @example
 * ```typescript
 * await removeSkillListFromPlatformList(["web"]) // 从每个 platform 的技能目录中删除 web 子目录
 * ```
 */
async function removeSkillListFromPlatformList(
  skillNameList: string[],
): Promise<void> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  await Promise.all(
    skillNameList.flatMap(skillName =>
      localPlatformList.map(async platformItem =>
        removeSkillItemFromPlatformItem(skillName, platformItem),
      ),
    ),
  )
}

/**
 * 从单个平台的技能目录中移除指定技能目录。
 *
 * @param skillName - 技能名
 * @param platformItem - 平台项
 * @throws AppError (AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE) - 当目录删除失败时
 */
async function removeSkillItemFromPlatformItem(
  skillName: string,
  platformItem: PlatformItem,
): Promise<void> {
  const targetSkillDirectoryPath = resolve(platformItem.platformSkillDirectoryPath, skillName)

  try {
    await removeDirectory(targetSkillDirectoryPath)
  }
  catch (error) {
    if (error instanceof Error) {
      throw new AppError(AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE, {
        param: {
          directoryPath: targetSkillDirectoryPath,
        },
      })
    }

    throw error
  }
}

export {
  removeSkillListFromPlatformList,
}
