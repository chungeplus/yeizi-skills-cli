import { cancel, isCancel, multiselect } from "@clack/prompts"

import { AppError, AppErrorCode } from "@/error"
import { LocalPlatformService } from "./local"

/**
 * 交互式多选目标平台名称列表。
 *
 * @returns 平台名列表
 * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 当配置平台均不可访问时
 * @throws AppError (AppErrorCode.PROMPT_CANCELLED_CODE) - 用户按 Ctrl+C 取消时
 *
 * @example
 * ```typescript
 * const platformNameList = await promptPlatformNameList() // ["codex", "claude"]
 * ```
 */
async function promptPlatformNameList(): Promise<string[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const selectedPlatformNameList = await multiselect<string>({
    message: "要安装到哪些平台？",
    options: localPlatformList.map(platformItem => ({
      value: platformItem.platformName,
      label: platformItem.platformName,
    })),
    required: true,
  })

  if (isCancel(selectedPlatformNameList)) {
    cancel("已取消操作。")
    throw new AppError(AppErrorCode.PROMPT_CANCELLED_CODE)
  }

  return selectedPlatformNameList
}

export { promptPlatformNameList }
