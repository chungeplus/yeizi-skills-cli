interface LocalPlatformItem {

  readonly localPlatformName: string

  readonly localPlatformHomeDirectoryPath: string

  readonly localPlatformSkillDirectoryPath: string

}

interface LocalPlatformConfig {

  readonly localPlatformList: LocalPlatformItem[]

}

export type { LocalPlatformConfig }
