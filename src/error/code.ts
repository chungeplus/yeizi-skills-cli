const AppErrorCode = {
  COMMANDER_NORMAL_EXIT_CODE: "commander_normal_exit_code",
  COMMANDER_HELP_DISPLAYED_CODE: "commander_help_displayed_code",
  COMMANDER_UNKNOWN_COMMAND_CODE: "commander_unknown_command_code",
  COMMANDER_UNKNOWN_OPTION_CODE: "commander_unknown_option_code",
  COMMANDER_OPTION_MISSING_ARGUMENT_CODE: "commander_option_missing_argument_code",
  COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE: "commander_mandatory_option_value_missing_code",
  COMMANDER_MISSING_ARGUMENT_CODE: "commander_missing_argument_code",
  COMMANDER_EXCESS_ARGUMENTS_CODE: "commander_excess_arguments_code",
  UNEXPECTED_ERROR_CODE: "unexpected_error_code",
  PACKAGE_BIN_CONFIG_MISSING_CODE: "package_bin_config_missing_code",
  PACKAGE_CONFIG_JSON_INVALID_CODE: "package_config_json_invalid_code",
  PACKAGE_CONFIG_SCHEMA_INVALID_CODE: "package_config_schema_invalid_code",
  PACKAGE_CONFIG_NOT_FOUND_CODE: "package_config_not_found_code",
  PLATFORM_NOT_FOUND_CODE: "platform_not_found_code",
  REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE: "remote_repository_download_failed_code",
  REMOTE_SKILL_EMPTY_CODE: "remote_skill_empty_code",
  REMOTE_SKILL_NOT_FOUND_CODE: "remote_skill_not_found_code",
  REMOTE_SKILL_ENTRY_INVALID_CODE: "remote_skill_entry_invalid_code",
  REMOTE_SKILL_ENTRY_MISSING_CODE: "remote_skill_entry_missing_code",
  REMOTE_SKILL_DIRECTORY_INVALID_CODE: "remote_skill_directory_invalid_code",
  PLATFORM_SKILL_DIRECTORY_INVALID_CODE: "platform_skill_directory_invalid_code",
  SKILL_OPTION_INVALID_FORMAT_CODE: "skill_option_invalid_format_code",
  SKILL_COPY_FAILED_CODE: "skill_copy_failed_code",
  PROMPT_CANCELLED_CODE: "prompt_cancelled_code",
  DIRECTORY_REMOVE_FAILED_CODE: "directory_remove_failed_code",
} as const

const CommanderErrorCode = {
  UNKNOWN_COMMAND_CODE: "commander.unknownCommand",
  UNKNOWN_OPTION_CODE: "commander.unknownOption",
  OPTION_MISSING_ARGUMENT_CODE: "commander.optionMissingArgument",
  MISSING_MANDATORY_OPTION_VALUE_CODE: "commander.missingMandatoryOptionValue",
  MISSING_ARGUMENT_CODE: "commander.missingArgument",
  EXCESS_ARGUMENTS_CODE: "commander.excessArguments",
} as const

const COMMANDER_HELP_DISPLAYED_CODE = "commander.help"

export { AppErrorCode, COMMANDER_HELP_DISPLAYED_CODE, CommanderErrorCode }
