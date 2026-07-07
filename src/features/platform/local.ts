import type { LocalPlatformConfig, PlatformItem } from "@/types/platform"

import { access } from "node:fs/promises"
import { localPlatformConfig } from "@/config/platform"
import { AppError, AppErrorCode } from "@/error"

class LocalPlatformService {
  private static localPlatformConfig: LocalPlatformConfig = localPlatformConfig

  private static localPlatformList: PlatformItem[] | undefined

  private static initLocalPlatformPromise: Promise<void> | null = null

  public static async initLocalPlatform(): Promise<void> {
    if (LocalPlatformService.initLocalPlatformPromise === null) {
      LocalPlatformService.initLocalPlatformPromise = LocalPlatformService.createLoadLocalPlatformListPromise()
    }

    return LocalPlatformService.initLocalPlatformPromise
  }

  private static async createLoadLocalPlatformListPromise(): Promise<void> {
    const localPlatformList = await LocalPlatformService.loadLocalPlatformList()

    LocalPlatformService.localPlatformList = localPlatformList
  }

  private static async loadLocalPlatformList(): Promise<PlatformItem[]> {
    const tempLocalPlatformList: PlatformItem[] = LocalPlatformService
      .localPlatformConfig
      .localPlatformList
      .map(localPlatformItem => ({
        platformName: localPlatformItem.localPlatformName,
        platformHomeDirectoryPath: localPlatformItem.localPlatformHomeDirectoryPath,
        platformSkillDirectoryPath: localPlatformItem.localPlatformSkillDirectoryPath,
      }))

    const localPlatformList: PlatformItem[] = []
    await Promise.all(
      tempLocalPlatformList.map(async (localPlatformItem: PlatformItem) => {
        try {
          await access(localPlatformItem.platformHomeDirectoryPath)
          await access(localPlatformItem.platformSkillDirectoryPath)
          localPlatformList.push(localPlatformItem)
        }
        // 该平台目录不可访问时视为未安装，跳过该项
        catch {
        }
      }),
    )

    localPlatformList.sort((leftPlatformItem, rightPlatformItem) =>
      leftPlatformItem.platformName.localeCompare(rightPlatformItem.platformName),
    )

    if (localPlatformList.length === 0) {
      const localPlatformNameList = LocalPlatformService.localPlatformConfig.localPlatformList.map(
        localPlatformItem => localPlatformItem.localPlatformName,
      )

      throw new AppError(AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
        param: {
          platformNameList: localPlatformNameList,
        },
      })
    }

    return localPlatformList
  }

  public static async getLocalPlatformList(): Promise<PlatformItem[]> {
    await LocalPlatformService.initLocalPlatform()

    return LocalPlatformService.localPlatformList!
  }

  public static async clearLocalPlatform(): Promise<void> {
    LocalPlatformService.localPlatformList = undefined
    LocalPlatformService.initLocalPlatformPromise = null
  }
}

export { LocalPlatformService }
