import type { AppErrorCodeType } from "./code"

/**
 * 应用错误的可选项。
 */
interface AppErrorOption<T extends AppErrorCodeType> {
  /**
   * 错误参数载荷。
   */
  param?: AppErrorParam<T>
}

/**
 * 错误码 → 参数形状映射。
 */
interface AppErrorParamMap {
  /**
   * 正常退出，无参数。
   */
  commander_normal_exit_code: undefined
  /**
   * 显示了帮助，无参数。
   */
  commander_help_displayed_code: undefined
  /**
   * 命令名不存在。
   */
  commander_unknown_command_code: { detailMessage: string }
  /**
   * 选项名不受支持。
   */
  commander_unknown_option_code: { detailMessage: string }
  /**
   * 选项缺少参数值。
   */
  commander_option_missing_argument_code: { detailMessage: string }
  /**
   * 缺少必填选项的值。
   */
  commander_mandatory_option_value_missing_code: { detailMessage: string }
  /**
   * 缺少必填参数。
   */
  commander_missing_argument_code: { detailMessage: string }
  /**
   * 命令参数过多。
   */
  commander_excess_arguments_code: { detailMessage: string }
  /**
   * 未预期的运行时异常。
   */
  unexpected_error_code: { detailMessage: string }
  /**
   * 缺少 bin 配置。
   */
  package_bin_config_missing_code: undefined
  /**
   * package.json 不是合法 JSON。
   */
  package_config_json_invalid_code: undefined
  /**
   * package.json 结构不符合 schema。
   */
  package_config_schema_invalid_code: undefined
  /**
   * 找不到 package.json。
   */
  package_config_not_found_code: undefined
  /**
   * 平台不存在。
   */
  platform_not_found_code: { platformNameList: string[] }
  /**
   * 远端仓库下载失败。
   */
  remote_repository_download_failed_code: undefined
  /**
   * 远端仓库没有可用技能。
   */
  remote_skill_empty_code: undefined
  /**
   * 请求的技能名不存在。
   */
  remote_skill_not_found_code: { skillNameList: string[] }
  /**
   * 技能条目 frontmatter 不合法。
   */
  remote_skill_entry_invalid_code: { skillEntryFilePath: string }
  /**
   * 技能条目 SKILL.md 缺失。
   */
  remote_skill_entry_missing_code: { skillEntryFilePath: string }
  /**
   * 远端技能目录不可读。
   */
  remote_skill_directory_invalid_code: { remoteSkillDirectoryPath: string }
  /**
   * 平台技能目录不可读。
   */
  platform_skill_directory_invalid_code: { platformName: string, platformSkillDirectoryPath: string }
  /**
   * 技能名 CSV 格式不合法。
   */
  skill_option_invalid_format_code: { rawSkillNameText: string }
  /**
   * 技能复制失败。
   */
  skill_copy_failed_code: { sourceDirectoryPath: string, targetDirectoryPath: string }
  /**
   * 用户取消交互式询问。
   */
  prompt_cancelled_code: undefined
  /**
   * 删除目录失败。
   */
  directory_remove_failed_code: { directoryPath: string }
  /**
   * 远端仓库尚未加载。
   */
  remote_repository_not_loaded_code: undefined
  /**
   * 远端技能列表尚未加载。
   */
  remote_skill_list_not_loaded_code: undefined
  /**
   * 本地平台列表尚未加载。
   */
  local_platform_list_not_loaded_code: undefined
}

/**
 * 错误码对应的参数形状类型。
 */
type AppErrorParam<K extends AppErrorCodeType> = AppErrorParamMap[K]

export type { AppErrorOption, AppErrorParam, AppErrorParamMap }
