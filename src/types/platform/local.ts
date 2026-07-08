/**
 * 单个本地安装平台的描述信息。
 */
interface LocalPlatformItem {
  /**
   * 平台在多选提示中展示的名称。
   */
  localPlatformName: string

  /**
   * 本地平台主目录绝对路径。
   */
  localPlatformHomeDirectoryPath: string

  /**
   * 本地平台技能目录绝对路径。
   */
  localPlatformSkillDirectoryPath: string
}

/**
 * 本地平台配置，枚举当前工具支持安装到的本地平台及其目录位置。
 */
interface LocalPlatformConfig {
  /**
   * 本地平台配置列表。
   */
  localPlatformList: LocalPlatformItem[]
}

export type { LocalPlatformConfig }
