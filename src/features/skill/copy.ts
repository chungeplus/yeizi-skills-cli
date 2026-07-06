import type { PlatformItem } from "@/types/platform"
import type { SkillItem } from "@/types/skill"

import { resolve } from "node:path"

import { AppError, AppErrorCode } from "@/error"
import { RemoteRepositoryService } from "@/features/repository"
import { copyDirectory } from "@/tools/filesystem"

async function copySkillListToPlatformList(
  skillList: SkillItem[],
  platformList: PlatformItem[],
): Promise<void> {
  const skillSourceRootDirectoryPath = await RemoteRepositoryService.getLocalRepositorySkillDirectoryPath()

  await Promise.all(
    skillList.flatMap(skillItem =>
      platformList.map(async platformItem =>
        copySkillItemToPlatformItem(skillItem, platformItem, skillSourceRootDirectoryPath),
      ),
    ),
  )
}

async function copySkillItemToPlatformItem(
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
      throw new AppError(AppErrorCode.FILE_COPY_FAILED_CODE, {
        param: {
          sourcePath: skillSourceDirectoryPath,
          targetPath: targetSkillDirectoryPath,
        },
        cause: error,
      })
    }

    throw error
  }
}

export { copySkillListToPlatformList }
