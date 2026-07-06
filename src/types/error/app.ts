import type { AppErrorCodeType } from "./code"

import type { PlatformName } from "@/types/platform"
import type { SkillName } from "@/types/skill"
import { AppErrorCode } from "@/error"

interface AppErrorOption<T extends AppErrorCodeType = AppErrorCodeType> {
  cause?: Error
  param?: AppErrorParam<T>
}

interface AppErrorParamMap {
  [AppErrorCode.COMMANDER_NORMAL_EXIT_CODE]: undefined
  [AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE]: undefined
  [AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_MISSING_MANDATORY_OPTION_VALUE_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_QUOTED_VALUE_MISSING_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_MESSAGE_INVALID_CODE]: { detailMessage: string }
  [AppErrorCode.COMMANDER_CODE_UNSUPPORTED_CODE]: { detailMessage: string }
  [AppErrorCode.UNEXPECTED_ERROR_CODE]: { detailMessage: string }
  [AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE]: undefined
  [AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE]: undefined
  [AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE]: undefined
  [AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE]: undefined
  [AppErrorCode.PLATFORM_NOT_FOUND_CODE]: { platformNameList: PlatformName[] }
  [AppErrorCode.REMOTE_REPOSITORY_PULL_FAILED_CODE]: undefined
  [AppErrorCode.REMOTE_SKILL_EMPTY_CODE]: undefined
  [AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE]: {
    rawSkillNameText: string
  }
  [AppErrorCode.SKILL_NOT_FOUND_CODE]: {
    skillNameList: SkillName[]
  }
  [AppErrorCode.FILE_COPY_FAILED_CODE]: { sourcePath: string, targetPath: string }
  [AppErrorCode.PROMPT_CANCELLED_CODE]: undefined
  [AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE]: { directoryPath: string }
}

type AppErrorParam<K extends AppErrorCodeType = AppErrorCodeType> = {
  [P in keyof AppErrorParamMap]: AppErrorParamMap[P]
}[K]

export type { AppErrorOption, AppErrorParam, AppErrorParamMap }
