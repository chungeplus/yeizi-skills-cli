import type { AppErrorCodeType } from "./code"

import type { PlatformName } from "@/types/platform"
import type { SkillName } from "@/types/skill"
import { AppErrorCode } from "@/error"

interface AppErrorOption<T extends AppErrorCodeType = AppErrorCodeType> {
  cause?: Error
  param?: AppErrorParam<T>
}

interface AppErrorParamMap {
  [AppErrorCode.UNEXPECTED_ERROR]: undefined
  [AppErrorCode.SYSTEM_ERROR]: { detailMessage: string }
  [AppErrorCode.APP_ERROR_INVALID]: { detailMessage: string }
  [AppErrorCode.CLI_USAGE_INVALID]: { detailMessage: string }
  [AppErrorCode.PACKAGE_BIN_CONFIG_MISSING]: undefined
  [AppErrorCode.PACKAGE_CONFIG_INVALID_FORMAT]: undefined
  [AppErrorCode.PACKAGE_CONFIG_NOT_FOUND]: undefined
  [AppErrorCode.PLATFORM_NOT_SUPPORTED]: { platformName: PlatformName }
  [AppErrorCode.PLATFORM_NOT_FOUND]: { platformNameList: PlatformName[] }
  [AppErrorCode.REMOTE_REPOSITORY_PULL_FAILED]: undefined
  [AppErrorCode.REMOTE_SKILL_EMPTY]: undefined
  [AppErrorCode.SKILL_OPTION_INVALID_FORMAT]: {
    rawSkillNameText: string
  }
  [AppErrorCode.SKILL_NOT_FOUND]: {
    skillNameList: SkillName[]
  }
  [AppErrorCode.PROMPT_CANCELLED]: undefined
  [AppErrorCode.FILE_COPY_FAILED]: { sourcePath: string, targetPath: string }
  [AppErrorCode.DIRECTORY_REMOVE_FAILED]: { directoryPath: string }
}

type AppErrorParam<K extends AppErrorCodeType = AppErrorCodeType> = {
  [P in keyof AppErrorParamMap]: AppErrorParamMap[P]
}[K]

export type { AppErrorOption, AppErrorParam, AppErrorParamMap }
