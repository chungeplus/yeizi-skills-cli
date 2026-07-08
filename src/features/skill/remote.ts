import type { SkillItem } from "@/types/skill"

import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

import matter from "gray-matter"
import { ZodError } from "zod"

import { AppError, AppErrorCode } from "@/error"
import { RemoteRepositoryService } from "@/features/repository"
import { skillEntryFileObjectSchema } from "@/schemas/skill"

/**
 * 技能条目入口文件名。
 */
const SKILL_ENTRY_FILE_NAME = "SKILL.md"

/**
 * 远端技能服务。读取远端仓库中的技能元数据列表，供 add/list 命令按名查找。
 */
class RemoteSkillService {
  private static remoteSkillList: SkillItem[] | undefined

  private static initRemoteSkillPromise: Promise<void> | null = null

  /**
   * 加载远端技能列表。
   *
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE) - 当技能子目录读取失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE) - 当技能条目解析不通过 `skillEntryFileObjectSchema` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE) - 当技能子目录下缺少 `SKILL.md` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_EMPTY_CODE) - 当技能子目录下没有任何技能子目录时
   */
  public static async initRemoteSkill(): Promise<void> {
    if (RemoteSkillService.initRemoteSkillPromise === null) {
      RemoteSkillService.initRemoteSkillPromise = RemoteSkillService.createLoadRemoteSkillListPromise()
    }

    return RemoteSkillService.initRemoteSkillPromise
  }

  /**
   * 创建懒加载远端技能列表的 Promise，避免并发重复加载。
   */
  private static async createLoadRemoteSkillListPromise(): Promise<void> {
    const remoteSkillList = await RemoteSkillService.loadRemoteSkillList()
    RemoteSkillService.remoteSkillList = remoteSkillList
  }

  /**
   * 读取远端技能列表。
   *
   * @returns 技能列表
   * @throws AppError (AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE) - 当技能子目录读取失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE) - 当技能条目解析不通过 `skillEntryFileObjectSchema` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE) - 当技能子目录下缺少 `SKILL.md` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_EMPTY_CODE) - 当技能子目录下没有任何技能子目录时
   */
  private static async loadRemoteSkillList(): Promise<SkillItem[]> {
    const remoteSkillDirectoryPath = await RemoteRepositoryService.getLocalRepositorySkillDirectoryPath()

    let remoteSkillDirectoryEntryList
    try {
      remoteSkillDirectoryEntryList = await readdir(remoteSkillDirectoryPath, { withFileTypes: true })
    }
    catch (error) {
      if (error instanceof Error) {
        throw new AppError(AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE, {
          param: { remoteSkillDirectoryPath },
        })
      }
      throw error
    }

    const remoteSkillSubdirectoryEntryList = remoteSkillDirectoryEntryList.filter(
      remoteSkillDirectoryEntryItem => remoteSkillDirectoryEntryItem.isDirectory(),
    )

    const remoteSkillList: SkillItem[] = await Promise.all(
      remoteSkillSubdirectoryEntryList.map(async (remoteSkillDirectoryEntryItem) => {
        const skillEntryFilePath = join(remoteSkillDirectoryPath, remoteSkillDirectoryEntryItem.name, SKILL_ENTRY_FILE_NAME)

        try {
          const rawSkillEntryFileText = await readFile(skillEntryFilePath, "utf-8")

          const rawSkillEntryFileObject = skillEntryFileObjectSchema.parse(matter(rawSkillEntryFileText).data)

          return {
            skillName: rawSkillEntryFileObject.name,
            skillDescription: rawSkillEntryFileObject.description,
          }
        }
        catch (error) {
          if (error instanceof ZodError) {
            throw new AppError(AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE, {
              param: { skillEntryFilePath },
            })
          }

          if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            throw new AppError(AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE, {
              param: { skillEntryFilePath },
            })
          }

          throw error
        }
      }),
    )

    remoteSkillList.sort((leftSkillItem, rightSkillItem) =>
      leftSkillItem.skillName.localeCompare(rightSkillItem.skillName),
    )

    if (remoteSkillList.length === 0) {
      throw new AppError(AppErrorCode.REMOTE_SKILL_EMPTY_CODE)
    }

    return remoteSkillList
  }

  /**
   * 校验给定技能名列表是否都存在于远端技能列表中。
   *
   * @param skillNameList - 技能名列表
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE) - 当技能子目录读取失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE) - 当技能条目解析不通过 `skillEntryFileObjectSchema` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE) - 当技能子目录下缺少 `SKILL.md` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_EMPTY_CODE) - 当远端仓库无任何技能时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE) - 当任一技能名不在远端列表中时
   */
  public static async validateSkillNameListExistInRemoteSkillList(skillNameList: string[]): Promise<void> {
    await RemoteSkillService.initRemoteSkill()

    const notExistSkillNameList = skillNameList.filter(skillName =>
      !RemoteSkillService.remoteSkillList!.some(skillItem => skillItem.skillName === skillName),
    )

    if (notExistSkillNameList.length > 0) {
      throw new AppError(AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE, {
        param: { skillNameList: notExistSkillNameList },
      })
    }
  }

  /**
   * 读取远端技能列表。
   *
   * @returns 远端技能列表
   * @throws AppError (AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE) - 当远端仓库下载失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE) - 当技能子目录读取失败时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE) - 当技能条目解析不通过 `skillEntryFileObjectSchema` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE) - 当技能子目录下缺少 `SKILL.md` 时
   * @throws AppError (AppErrorCode.REMOTE_SKILL_EMPTY_CODE) - 当远端仓库中没有任何技能时
   */
  public static async getRemoteSkillList(): Promise<SkillItem[]> {
    await RemoteSkillService.initRemoteSkill()

    return RemoteSkillService.remoteSkillList!
  }

  /**
   * 重置已加载的远端技能列表。
   */
  public static async clearRemoteSkill(): Promise<void> {
    RemoteSkillService.remoteSkillList = undefined
    RemoteSkillService.initRemoteSkillPromise = null
  }
}

export { RemoteSkillService }
