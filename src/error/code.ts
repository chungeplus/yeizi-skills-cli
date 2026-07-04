const AppErrorCode = {
  UNEXPECTED_ERROR: "unexpected_error",
  SYSTEM_ERROR: "system_error",
  APP_ERROR_INVALID: "app_error_invalid",
  CLI_USAGE_INVALID: "cli_usage_invalid",
  PACKAGE_BIN_CONFIG_MISSING: "package_bin_missing",
  PACKAGE_CONFIG_INVALID_FORMAT: "package_config_invalid_format",
  PACKAGE_CONFIG_NOT_FOUND: "package_config_not_found",
  PLATFORM_NOT_SUPPORTED: "platform_not_supported",
  PLATFORM_NOT_FOUND: "platform_not_found",
  REMOTE_REPOSITORY_PULL_FAILED: "remote_repository_pull_failed",
  REMOTE_SKILL_EMPTY: "remote_skill_empty",
  SKILL_OPTION_INVALID_FORMAT: "skill_option_invalid_format",
  SKILL_NOT_FOUND: "skill_not_found",
  PROMPT_CANCELLED: "prompt_cancelled",
  FILE_COPY_FAILED: "file_copy_failed",
  DIRECTORY_REMOVE_FAILED: "directory_remove_failed",
} as const

export { AppErrorCode }
