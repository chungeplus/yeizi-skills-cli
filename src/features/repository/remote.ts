import type { RemoteRepositoryConfig } from "@/types/repository"
import { mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"

import { join } from "node:path"
import { spinner } from "@clack/prompts"
import { downloadTemplate } from "giget"

import { remoteRepositoryConfig } from "@/config/repository"
import { AppError, AppErrorCode } from "@/error"
import { removeDirectory } from "@/tools/filesystem"

class RemoteRepositoryService {
  private static remoteRepositoryConfig: RemoteRepositoryConfig = remoteRepositoryConfig

  private static localRepositoryDirectoryPath: string | undefined

  private static initRemoteRepositoryPromise: Promise<[void]> | null = null

  public static async initRemoteRepository(): Promise<[void]> {
    if (RemoteRepositoryService.initRemoteRepositoryPromise === null) {
      RemoteRepositoryService.initRemoteRepositoryPromise = Promise.all([
        RemoteRepositoryService.createLoadLocalRepositoryDirectoryPathPromise(),
      ])
    }

    return RemoteRepositoryService.initRemoteRepositoryPromise
  }

  private static async createLoadLocalRepositoryDirectoryPathPromise(): Promise<void> {
    const localRepositoryDirectoryPath = await RemoteRepositoryService.loadLocalRepositoryDirectoryPath()
    RemoteRepositoryService.localRepositoryDirectoryPath = localRepositoryDirectoryPath!
  }

  private static async loadLocalRepositoryDirectoryPath(): Promise<string> {
    const tempDirectoryPath = await mkdtemp(join(tmpdir(), "yeizi-skills-repo-"))
    const loadSpinner = spinner()
    loadSpinner.start("拉取远程仓库中")

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
      catch {
      }
      loadSpinner.stop("拉取远程仓库失败")
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.REMOTE_REPOSITORY_PULL_FAILED_CODE, {
          cause: error,
        })
      }
      throw error
    }
  }

  private static getRemoteRepositoryRequestPath(): string {
    const {
      remoteRepositoryOwner,
      remoteRepositoryName,
      remoteRepositoryBranch,
    } = RemoteRepositoryService.remoteRepositoryConfig

    return `gh:${remoteRepositoryOwner}/${remoteRepositoryName}#${remoteRepositoryBranch}`
  }

  public static async getLocalRepositoryDirectoryPath(): Promise<string> {
    await RemoteRepositoryService.initRemoteRepository()

    return RemoteRepositoryService.localRepositoryDirectoryPath!
  }

  public static async getLocalRepositorySkillDirectoryPath(): Promise<string> {
    await RemoteRepositoryService.initRemoteRepository()

    return join(
      RemoteRepositoryService.localRepositoryDirectoryPath!,
      RemoteRepositoryService.remoteRepositoryConfig.remoteRepositorySkillDirectoryName,
    )
  }

  public static async resetRemoteRepository(): Promise<void> {
    if (RemoteRepositoryService.localRepositoryDirectoryPath === undefined) {
      return
    }

    try {
      await removeDirectory(RemoteRepositoryService.localRepositoryDirectoryPath)
    }
    catch (error) {
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE, {
          param: {
            directoryPath: RemoteRepositoryService.localRepositoryDirectoryPath,
          },
          cause: error,
        })
      }

      throw error
    }

    RemoteRepositoryService.localRepositoryDirectoryPath = undefined
    RemoteRepositoryService.initRemoteRepositoryPromise = null
  }
}

export { RemoteRepositoryService }
