/**
 * 单个平台的描述信息。
 */
interface PlatformItem {
  /**
   * 平台名。
   */
  platformName: string

  /**
   * 平台主目录绝对路径。
   */
  platformHomeDirectoryPath: string

  /**
   * 平台技能目录绝对路径。
   */
  platformSkillDirectoryPath: string
}

/**
 * 平台描述信息的有序集合。
 */
type PlatformList = PlatformItem[]

export type {
  PlatformItem,
  PlatformList,
}
