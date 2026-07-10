import type { PlatformItem } from "@/types/platform"

import { AppError, AppErrorCode } from "@/error"
import { LocalPlatformService } from "./local"

/**
 * 按平台名列表查对应的 `PlatformItem`。
 *
 * @param platformNameList - 平台名列表
 * @returns 平台项列表
 * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 当任一平台名不存在时
 *
 * @example
 * ```typescript
 * const platformList = await buildPlatformListByPlatformNameList(["codex", "claude"]) // [{ platformName: "codex", ... }, { platformName: "claude", ... }]
 * ```
 */
async function buildPlatformListByPlatformNameList(platformNameList: string[]): Promise<PlatformItem[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const platformList: PlatformItem[] = []
  const notFoundPlatformNameList: string[] = []

  platformNameList.forEach((platformName) => {
    const matchedPlatformItem = localPlatformList.find(
      localPlatformItem => localPlatformItem.platformName === platformName,
    )

    if (matchedPlatformItem !== undefined) {
      platformList.push(matchedPlatformItem)
      return
    }

    notFoundPlatformNameList.push(platformName)
  })

  if (notFoundPlatformNameList.length > 0) {
    throw new AppError(AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
      param: { platformNameList: notFoundPlatformNameList },
    })
  }

  return platformList
}

export { buildPlatformListByPlatformNameList }
