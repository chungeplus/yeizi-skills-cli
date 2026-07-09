import type { PlatformItem } from "@/types/platform"

import { AppError, AppErrorCode } from "@/error"
import { LocalPlatformService } from "./local"

/**
 * 按平台名列表查对应的 `PlatformItem`。
 *
 * @param platformNameList - 平台名列表
 * @returns 平台项列表
 * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 当本地平台列表加载失败或平台名不存在时
 *
 * @example
 * ```typescript
 * const platformList = await buildPlatformList(["codex", "claude"]) // [{ platformName: "codex", platformHomeDirectoryPath: "/Users/.../.codex", platformSkillDirectoryPath: "/Users/.../.codex/skills" }, { platformName: "claude", platformHomeDirectoryPath: "/Users/.../.claude", platformSkillDirectoryPath: "/Users/.../.claude/skills" }]
 * ```
 */
async function buildPlatformList(platformNameList: string[]): Promise<PlatformItem[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const notFoundPlatformNameList = platformNameList.filter(platformName =>
    !localPlatformList.some(localPlatformItem => localPlatformItem.platformName === platformName),
  )

  if (notFoundPlatformNameList.length > 0) {
    throw new AppError(AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
      param: { platformNameList: notFoundPlatformNameList },
    })
  }

  const platformList: PlatformItem[] = []

  platformNameList.forEach((platformName) => {
    const platformItem = localPlatformList.find(localPlatformItem => localPlatformItem.platformName === platformName)

    if (platformItem === undefined) {
      throw new AppError(AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
        param: { platformNameList: [platformName] },
      })
    }

    platformList.push(platformItem)
  })

  return platformList
}

export { buildPlatformList }
