interface LocalPlatformItem {

  localPlatformName: string

  localPlatformHomeDirectoryPath: string

  localPlatformSkillDirectoryPath: string

}

interface LocalPlatformConfig {

  localPlatformList: LocalPlatformItem[]

}

export type { LocalPlatformConfig }
