type PlatformName = string

type PlatformHomeDirectoryPath = string

type PlatformSkillDirectoryPath = string

interface PlatformItem {

  platformName: PlatformName

  platformHomeDirectoryPath: PlatformHomeDirectoryPath

  platformSkillDirectoryPath: PlatformSkillDirectoryPath
}

type PlatformItemList = PlatformItem[]

export type {
  PlatformHomeDirectoryPath,
  PlatformItem,
  PlatformItemList,
  PlatformName,
  PlatformSkillDirectoryPath,
}
