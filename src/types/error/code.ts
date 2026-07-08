/**
 * 应用错误码。
 */
type AppErrorCodeType
  = | "commander_normal_exit_code"
    | "commander_help_displayed_code"
    | "commander_unknown_command_code"
    | "commander_unknown_option_code"
    | "commander_option_missing_argument_code"
    | "commander_mandatory_option_value_missing_code"
    | "commander_missing_argument_code"
    | "commander_excess_arguments_code"
    | "unexpected_error_code"
    | "package_bin_config_missing_code"
    | "package_config_json_invalid_code"
    | "package_config_schema_invalid_code"
    | "package_config_not_found_code"
    | "platform_not_found_code"
    | "remote_repository_download_failed_code"
    | "remote_skill_empty_code"
    | "remote_skill_not_found_code"
    | "remote_skill_entry_invalid_code"
    | "remote_skill_entry_missing_code"
    | "remote_skill_directory_invalid_code"
    | "platform_skill_directory_invalid_code"
    | "skill_option_invalid_format_code"
    | "skill_copy_failed_code"
    | "prompt_cancelled_code"
    | "directory_remove_failed_code"
    | "remote_repository_not_loaded_code"
    | "remote_skill_list_not_loaded_code"
    | "local_platform_list_not_loaded_code"

export type { AppErrorCodeType }
