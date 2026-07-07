interface PlatformItem {

  platformName: string

  platformHomeDirectoryPath: string

  platformSkillDirectoryPath: string
}

type PlatformList = PlatformItem[]

export type {
  PlatformItem,
  PlatformList,
}
