type PlatformName = string

type PlatformHomeDirectoryPath = string

type PlatformSkillDirectoryPath = string

interface PlatformItem {

  platformName: PlatformName

  platformHomeDirectoryPath: PlatformHomeDirectoryPath

  platformSkillDirectoryPath: PlatformSkillDirectoryPath
}

type PlatformList = PlatformItem[]

export type {
  PlatformHomeDirectoryPath,
  PlatformItem,
  PlatformList,
  PlatformName,
  PlatformSkillDirectoryPath,
}
