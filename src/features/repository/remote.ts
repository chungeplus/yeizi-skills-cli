import type { RemoteRepositoryConfig } from "@/types/repository"
import { mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"

import { join } from "node:path"
import { spinner } from "@clack/prompts"
import { downloadTemplate } from "giget"

import { remoteRepositoryConfig } from "@/config/repository"
import { AppError, AppErrorCode } from "@/error"
import { removeDirectory } from "@/tools/filesystem"

/**
 * 远端仓库服务。把远端仓库下载到本地临时目录，供技能服务读取其中的技能条目。
 */
class RemoteRepositoryService {
  private static remoteRepositoryConfig: RemoteRepositoryConfig = remoteRepositoryConfig

  private static localRepositoryDirectoryPath: string | undefined

  private static initRemoteRepositoryPromise: Promise<void> | null = null

  /**
   * 下载远端仓库到本地临时目录。
   *
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
   */
  public static async initRemoteRepository(): Promise<void> {
    if (RemoteRepositoryService.initRemoteRepositoryPromise === null) {
      RemoteRepositoryService.initRemoteRepositoryPromise = RemoteRepositoryService.createLoadLocalRepositoryDirectoryPathPromise()
    }

    return RemoteRepositoryService.initRemoteRepositoryPromise
  }

  /**
   * 创建懒加载远端仓库本地目录的 Promise。
   */
  private static async createLoadLocalRepositoryDirectoryPathPromise(): Promise<void> {
    const localRepositoryDirectoryPath = await RemoteRepositoryService.loadLocalRepositoryDirectoryPath()
    RemoteRepositoryService.localRepositoryDirectoryPath = localRepositoryDirectoryPath
  }

  /**
   * 下载远端仓库到本地临时目录。
   *
   * @returns 仓库目录绝对路径
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 远端仓库下载失败时
   */
  private static async loadLocalRepositoryDirectoryPath(): Promise<string> {
    const loadSpinner = spinner()
    loadSpinner.start("拉取远程仓库中")
    const tempDirectoryPath = await mkdtemp(join(tmpdir(), "yeizi-skills-repo-"))

    try {
      const downloadResult = await downloadTemplate(RemoteRepositoryService.getRemoteRepositoryRequestPath(), {
        dir: tempDirectoryPath,
        forceClean: true,
      })

      loadSpinner.stop("拉取远程仓库完成。")
      return downloadResult.dir
    }
    catch (error) {
      try {
        await removeDirectory(tempDirectoryPath)
      }
      // 主流程已失败，临时目录清理错误不再向上传播
      catch {
      }
      loadSpinner.stop("拉取远程仓库失败。")
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE)
      }
      throw error
    }
  }

  /**
   * 获取仓库源地址。
   *
   * @returns 仓库源地址
   */
  private static getRemoteRepositoryRequestPath(): string {
    const {
      remoteRepositoryOwner,
      remoteRepositoryName,
      remoteRepositoryBranch,
    } = RemoteRepositoryService.remoteRepositoryConfig

    return `gh:${remoteRepositoryOwner}/${remoteRepositoryName}#${remoteRepositoryBranch}`
  }

  /**
   * 读取远端仓库本地目录绝对路径。
   *
   * @returns 仓库本地目录绝对路径
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
   */
  public static async getLocalRepositoryDirectoryPath(): Promise<string> {
    await RemoteRepositoryService.initRemoteRepository()

    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      throw new AppError(AppErrorCode.REMOTE_REPOSITORY_NOT_LOADED_CODE)
    }

    return RemoteRepositoryService.localRepositoryDirectoryPath
  }

  /**
   * 读取远端仓库中技能子目录的绝对路径。
   *
   * @returns 技能子目录绝对路径
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
   */
  public static async getLocalRepositorySkillDirectoryPath(): Promise<string> {
    await RemoteRepositoryService.initRemoteRepository()

    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      throw new AppError(AppErrorCode.REMOTE_REPOSITORY_NOT_LOADED_CODE)
    }

    return join(
      RemoteRepositoryService.localRepositoryDirectoryPath,
      RemoteRepositoryService.remoteRepositoryConfig.remoteRepositorySkillDirectoryName,
    )
  }

  /**
   * 删除已下载的本地仓库目录。
   *
   * @throws AppError (AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE) - 本地仓库目录删除失败时
   */
  public static async clearRemoteRepository(): Promise<void> {
    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      RemoteRepositoryService.initRemoteRepositoryPromise = null
      return
    }

    const directoryPath = RemoteRepositoryService.localRepositoryDirectoryPath

    try {
      await removeDirectory(directoryPath)
    }
    catch (error) {
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE, {
          param: {
            directoryPath,
          },
        })
      }

      throw error
    }
    finally {
      RemoteRepositoryService.localRepositoryDirectoryPath = undefined
      RemoteRepositoryService.initRemoteRepositoryPromise = null
    }
  }
}

export { RemoteRepositoryService }
