import type { AppErrorCodeType } from "./code"

interface AppErrorOption<T extends AppErrorCodeType> {
  param?: AppErrorParam<T>
}

interface AppErrorParamMap {
  commander_normal_exit_code: undefined
  commander_help_displayed_code: undefined
  commander_unknown_command_code: { detailMessage: string }
  commander_unknown_option_code: { detailMessage: string }
  commander_option_missing_argument_code: { detailMessage: string }
  commander_mandatory_option_value_missing_code: { detailMessage: string }
  commander_missing_argument_code: { detailMessage: string }
  commander_excess_arguments_code: { detailMessage: string }
  unexpected_error_code: { detailMessage: string }
  package_bin_config_missing_code: undefined
  package_config_json_invalid_code: undefined
  package_config_schema_invalid_code: undefined
  package_config_not_found_code: undefined
  platform_not_found_code: { platformNameList: string[] }
  remote_repository_download_failed_code: undefined
  remote_skill_empty_code: undefined
  remote_skill_not_found_code: { skillNameList: string[] }
  remote_skill_entry_invalid_code: { skillEntryFilePath: string }
  remote_skill_entry_missing_code: { skillEntryFilePath: string }
  remote_skill_directory_invalid_code: { remoteSkillDirectoryPath: string }
  platform_skill_directory_invalid_code: { platformName: string, platformSkillDirectoryPath: string }
  skill_option_invalid_format_code: { rawSkillNameText: string }
  skill_copy_failed_code: { sourceDirectoryPath: string, targetDirectoryPath: string }
  prompt_cancelled_code: undefined
  directory_remove_failed_code: { directoryPath: string }
}

type AppErrorParam<K extends AppErrorCodeType> = AppErrorParamMap[K]

export type { AppErrorOption, AppErrorParam, AppErrorParamMap }
