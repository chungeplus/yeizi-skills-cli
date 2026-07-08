import type { LocalPlatformConfig, PlatformItem } from "@/types/platform"

import { access } from "node:fs/promises"
import { localPlatformConfig } from "@/config/platform"
import { AppError, AppErrorCode } from "@/error"

/**
 * 本地平台服务。枚举可安装的本地平台目录，供 add/list 命令按名查找。
 */
class LocalPlatformService {
  private static localPlatformConfig: LocalPlatformConfig = localPlatformConfig

  private static localPlatformList: PlatformItem[] | undefined

  private static initLocalPlatformPromise: Promise<void> | null = null

  /**
   * 探测本地平台目录。
   *
   * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 配置平台均不可访问时
   */
  public static async initLocalPlatform(): Promise<void> {
    if (LocalPlatformService.initLocalPlatformPromise === null) {
      LocalPlatformService.initLocalPlatformPromise = LocalPlatformService.createLoadLocalPlatformListPromise()
    }

    return LocalPlatformService.initLocalPlatformPromise
  }

  /**
   * 创建懒加载本地平台列表的 Promise。
   */
  private static async createLoadLocalPlatformListPromise(): Promise<void> {
    const localPlatformList = await LocalPlatformService.loadLocalPlatformList()

    LocalPlatformService.localPlatformList = localPlatformList
  }

  /**
   * 探测本地平台目录。不可访问的平台项会被直接排除（视为"未安装"）；仅在全部不可访问时抛错。
   *
   * @returns 平台列表
   * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 配置平台均不可访问时
   */
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

  /**
   * 读取本地平台列表。
   *
   * @returns 平台列表
   * @throws AppError (AppErrorCode.PLATFORM_NOT_FOUND_CODE) - 当配置平台均不可访问时
   */
  public static async getLocalPlatformList(): Promise<PlatformItem[]> {
    await LocalPlatformService.initLocalPlatform()

    if (LocalPlatformService.localPlatformList === undefined) {
      throw new AppError(AppErrorCode.LOCAL_PLATFORM_LIST_NOT_LOADED_CODE)
    }

    return LocalPlatformService.localPlatformList
  }

  /**
   * 重置已发现的本地平台列表。
   */
  public static async clearLocalPlatform(): Promise<void> {
    LocalPlatformService.localPlatformList = undefined
    LocalPlatformService.initLocalPlatformPromise = null
  }
}

export { LocalPlatformService }
