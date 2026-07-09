/**
 * 应用错误码集合。
 */
const AppErrorCode = {
  /**
   * 正常退出。
   */
  COMMANDER_NORMAL_EXIT_CODE: "commander_normal_exit_code",
  /**
   * 输出 --help。
   */
  COMMANDER_HELP_DISPLAYED_CODE: "commander_help_displayed_code",
  /**
   * 命令名不存在。
   */
  COMMANDER_UNKNOWN_COMMAND_CODE: "commander_unknown_command_code",
  /**
   * 选项名不受支持。
   */
  COMMANDER_UNKNOWN_OPTION_CODE: "commander_unknown_option_code",
  /**
   * 选项缺少参数值。
   */
  COMMANDER_OPTION_MISSING_ARGUMENT_CODE: "commander_option_missing_argument_code",
  /**
   * 缺少必填选项的值。
   */
  COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE: "commander_mandatory_option_value_missing_code",
  /**
   * 缺少必填参数。
   */
  COMMANDER_MISSING_ARGUMENT_CODE: "commander_missing_argument_code",
  /**
   * 命令参数过多。
   */
  COMMANDER_EXCESS_ARGUMENTS_CODE: "commander_excess_arguments_code",
  /**
   * 未预期的运行时异常。
   */
  UNEXPECTED_ERROR_CODE: "unexpected_error_code",
  /**
   * package.json 中缺少 bin 配置。
   */
  PACKAGE_BIN_CONFIG_MISSING_CODE: "package_bin_config_missing_code",
  /**
   * package.json 不是合法 JSON。
   */
  PACKAGE_CONFIG_JSON_INVALID_CODE: "package_config_json_invalid_code",
  /**
   * package.json 不符合 schema。
   */
  PACKAGE_CONFIG_SCHEMA_INVALID_CODE: "package_config_schema_invalid_code",
  /**
   * 找不到 package.json。
   */
  PACKAGE_CONFIG_NOT_FOUND_CODE: "package_config_not_found_code",
  /**
   * 没有可用的本地平台。
   */
  PLATFORM_NOT_FOUND_CODE: "platform_not_found_code",
  /**
   * 远端仓库下载失败。
   */
  REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE: "remote_repository_download_failed_code",
  /**
   * 远端仓库中没有可用技能。
   */
  REMOTE_SKILL_EMPTY_CODE: "remote_skill_empty_code",
  /**
   * 请求的技能名不存在。
   */
  REMOTE_SKILL_NOT_FOUND_CODE: "remote_skill_not_found_code",
  /**
   * 技能条目 frontmatter 不合法。
   */
  REMOTE_SKILL_ENTRY_INVALID_CODE: "remote_skill_entry_invalid_code",
  /**
   * 技能条目 SKILL.md 缺失。
   */
  REMOTE_SKILL_ENTRY_MISSING_CODE: "remote_skill_entry_missing_code",
  /**
   * 远端技能目录不可读。
   */
  REMOTE_SKILL_DIRECTORY_INVALID_CODE: "remote_skill_directory_invalid_code",
  /**
   * 平台技能目录不可读。
   */
  PLATFORM_SKILL_DIRECTORY_INVALID_CODE: "platform_skill_directory_invalid_code",
  /**
   * 技能名 CSV 格式不合法。
   */
  SKILL_OPTION_INVALID_FORMAT_CODE: "skill_option_invalid_format_code",
  /**
   * 技能复制失败。
   */
  SKILL_COPY_FAILED_CODE: "skill_copy_failed_code",
  /**
   * 用户在交互式询问中取消。
   */
  PROMPT_CANCELLED_CODE: "prompt_cancelled_code",
  /**
   * 删除已下载目录失败。
   */
  DIRECTORY_REMOVE_FAILED_CODE: "directory_remove_failed_code",
  /**
   * 远端仓库尚未加载。
   */
  REMOTE_REPOSITORY_NOT_LOADED_CODE: "remote_repository_not_loaded_code",
  /**
   * 远端技能列表尚未加载。
   */
  REMOTE_SKILL_LIST_NOT_LOADED_CODE: "remote_skill_list_not_loaded_code",
  /**
   * 本地平台列表尚未加载。
   */
  LOCAL_PLATFORM_LIST_NOT_LOADED_CODE: "local_platform_list_not_loaded_code",
  /**
   * 错误码缺少必填 param 参数（编程错误）。
   */
  APP_ERROR_PARAM_MISSING_CODE: "app_error_param_missing_code",
} as const

/**
 * 错误码字面量集合。
 */
const CommanderErrorCode = {
  /**
   * 未知命令名。
   */
  UNKNOWN_COMMAND_CODE: "commander.unknownCommand",
  /**
   * 未知选项名。
   */
  UNKNOWN_OPTION_CODE: "commander.unknownOption",
  /**
   * 选项缺少参数值。
   */
  OPTION_MISSING_ARGUMENT_CODE: "commander.optionMissingArgument",
  /**
   * 缺少必填选项的值。
   */
  MISSING_MANDATORY_OPTION_VALUE_CODE: "commander.missingMandatoryOptionValue",
  /**
   * 缺少必填参数。
   */
  MISSING_ARGUMENT_CODE: "commander.missingArgument",
  /**
   * 命令参数过多。
   */
  EXCESS_ARGUMENTS_CODE: "commander.excessArguments",
} as const

/**
 * 输出 --help 时抛出的 code 字面量。
 */
const COMMANDER_HELP_DISPLAYED_CODE = "commander.help"

export { AppErrorCode, COMMANDER_HELP_DISPLAYED_CODE, CommanderErrorCode }
