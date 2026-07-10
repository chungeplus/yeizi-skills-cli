import type { PlatformItem } from "@/types/platform"
import type { SkillItem } from "@/types/skill"

import { resolve } from "node:path"

import { AppError, AppErrorCode } from "@/error"
import { RemoteRepositoryService } from "@/features/repository"
import { copyDirectory } from "@/tools/filesystem"

/**
 * 把每个技能从远端仓库本地目录添加到每个目标平台。
 *
 * @param skillList - 技能列表
 * @param platformList - 平台列表
 *
 * @example
 * ```typescript
 * await addSkillListToPlatformList(skillList, platformList) // 把每个 skill 添加到每个 platform 的技能目录
 * ```
 */
async function addSkillListToPlatformList(
  skillList: SkillItem[],
  platformList: PlatformItem[],
): Promise<void> {
  const skillSourceRootDirectoryPath = await RemoteRepositoryService.getLocalRepositorySkillDirectoryPath()

  await Promise.all(
    skillList.flatMap(skillItem =>
      platformList.map(async platformItem =>
        addSkillItemToPlatformItem(skillItem, platformItem, skillSourceRootDirectoryPath),
      ),
    ),
  )
}

/**
 * 把单个技能目录从远端根目录添加到目标平台的技能目录。
 *
 * @param skillItem - 技能项
 * @param platformItem - 目标平台项
 * @param skillSourceRootDirectoryPath - 远端仓库本地技能根目录
 * @throws AppError (AppErrorCode.SKILL_ADD_FAILED_CODE) - 当目录复制失败时
 */
async function addSkillItemToPlatformItem(
  skillItem: SkillItem,
  platformItem: PlatformItem,
  skillSourceRootDirectoryPath: string,
): Promise<void> {
  const skillSourceDirectoryPath = resolve(skillSourceRootDirectoryPath, skillItem.skillName)
  const targetSkillDirectoryPath = resolve(platformItem.platformSkillDirectoryPath, skillItem.skillName)

  try {
    await copyDirectory(skillSourceDirectoryPath, targetSkillDirectoryPath)
  }
  catch (error) {
    if (error instanceof Error) {
      throw new AppError(AppErrorCode.SKILL_ADD_FAILED_CODE, {
        param: {
          sourceDirectoryPath: skillSourceDirectoryPath,
          targetDirectoryPath: targetSkillDirectoryPath,
        },
      })
    }

    throw error
  }
}

export { addSkillListToPlatformList }
