import type { PlatformItem } from "@/types/platform"

import { LocalPlatformService } from "./local"

/**
 * 按平台名列表查对应的 `PlatformItem`。
 *
 * @param platformNameList - 平台名列表
 * @returns 平台项列表
 * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 当本地平台列表加载失败时
 *
 * @example
 * ```typescript
 * const platformList = await buildPlatformList(["codex", "claude"]) // [{ platformName: "codex", platformHomeDirectoryPath: "/Users/.../.codex", platformSkillDirectoryPath: "/Users/.../.codex/skills" }, { platformName: "claude", platformHomeDirectoryPath: "/Users/.../.claude", platformSkillDirectoryPath: "/Users/.../.claude/skills" }]
 * ```
 */
async function buildPlatformList(platformNameList: string[]): Promise<PlatformItem[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const platformList = platformNameList.map(
    platformName => localPlatformList.find(localPlatformItem => localPlatformItem.platformName === platformName)!,
  )

  return platformList
}

export { buildPlatformList }
