import { cancel, isCancel, multiselect } from "@clack/prompts"

import { AppError, AppErrorCode } from "@/error"
import { LocalPlatformService } from "./local"

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
