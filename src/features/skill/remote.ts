import type { SkillItem, SkillName } from "@/types/skill"

import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

import matter from "gray-matter"

import { AppError, AppErrorCode } from "@/error"
import { RemoteRepositoryService } from "@/features/repository"
import { skillEntryFileObjectSchema } from "@/schemas/skill/remote"

const SKILL_ENTRY_FILE_NAME = "SKILL.md"

class RemoteSkillService {
  private static remoteSkillList: SkillItem[] | undefined

  private static initRemoteSkillPromise: Promise<[void]> | null = null

  public static async initRemoteSkill(): Promise<[void]> {
    if (RemoteSkillService.initRemoteSkillPromise === null) {
      RemoteSkillService.initRemoteSkillPromise = Promise.all([
        RemoteSkillService.createLoadRemoteSkillListPromise(),
      ])
    }

    return RemoteSkillService.initRemoteSkillPromise
  }

  private static async createLoadRemoteSkillListPromise(): Promise<void> {
    const remoteSkillList = await RemoteSkillService.loadRemoteSkillList()
    RemoteSkillService.remoteSkillList = remoteSkillList
  }

  private static async loadRemoteSkillList(): Promise<SkillItem[]> {
    const remoteSkillDirectoryPath = await RemoteRepositoryService.getLocalRepositorySkillDirectoryPath()

    const remoteSkillDirectoryEntryList = await readdir(remoteSkillDirectoryPath, { withFileTypes: true })

    const remoteSkillSubdirectoryEntryList = remoteSkillDirectoryEntryList.filter(
      remoteSkillDirectoryEntryItem => remoteSkillDirectoryEntryItem.isDirectory(),
    )

    const remoteSkillList: SkillItem[] = await Promise.all(
      remoteSkillSubdirectoryEntryList.map(async (remoteSkillDirectoryEntryItem) => {
        const skillEntryFilePath = join(remoteSkillDirectoryPath, remoteSkillDirectoryEntryItem.name, SKILL_ENTRY_FILE_NAME)

        const rawSkillEntryFileText = await readFile(skillEntryFilePath, "utf-8")

        const rawSkillEntryFileObject = skillEntryFileObjectSchema.parse(matter(rawSkillEntryFileText).data)

        return {
          skillName: rawSkillEntryFileObject.name,
          skillDescription: rawSkillEntryFileObject.description,
        }
      }),
    )

    remoteSkillList.sort((leftSkillItem, rightSkillItem) =>
      leftSkillItem.skillName.localeCompare(rightSkillItem.skillName),
    )

    return remoteSkillList
  }

  public static async validateSkillNameListExistInRemoteSkillList(skillNameList: SkillName[]): Promise<void> {
    await RemoteSkillService.initRemoteSkill()

    const notExistSkillNameList = skillNameList.filter(skillName =>
      !RemoteSkillService.remoteSkillList!.some(skillItem => skillItem.skillName === skillName),
    )

    if (notExistSkillNameList.length > 0) {
      throw new AppError(AppErrorCode.SKILL_NOT_FOUND, {
        param: { skillNameList: notExistSkillNameList },
      })
    }
  }

  public static async getRemoteSkillList(): Promise<SkillItem[]> {
    await RemoteSkillService.initRemoteSkill()

    return RemoteSkillService.remoteSkillList!
  }

  public static async resetRemoteSkill(): Promise<void> {
    RemoteSkillService.remoteSkillList = undefined
    RemoteSkillService.initRemoteSkillPromise = null
  }
}

export { RemoteSkillService }
