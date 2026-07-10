import type {
  AppErrorCodeType,
  AppErrorDefinition,
  AppErrorDefinitionMap,
} from "@/types/error"
import { AppError } from "./app"
import { AppErrorCode } from "./code"

/**
 * 按错误码提供错误信息。
 */
const appErrorDefinitionMap: AppErrorDefinitionMap = {
  [AppErrorCode.COMMANDER_NORMAL_EXIT_CODE]: {
    appErrorTitle: "命令已结束",
    buildAppErrorMessage(): string {
      return "命令已正常结束。"
    },
  },
  [AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE]: {
    appErrorTitle: "已显示帮助",
    buildAppErrorMessage(): string {
      return "已显示帮助信息。"
    },
  },
  [AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE]: {
    appErrorTitle: "命令不存在",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE]: {
    appErrorTitle: "选项不受支持",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE]: {
    appErrorTitle: "选项缺少参数值",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE]: {
    appErrorTitle: "必填选项值缺失",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE]: {
    appErrorTitle: "缺少必填参数",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE]: {
    appErrorTitle: "命令参数过多",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.UNEXPECTED_ERROR_CODE]: {
    appErrorTitle: "程序异常",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.UNEXPECTED_ERROR_CODE },
        })
      }
      return appErrorParam.detailMessage
    },
  },
  [AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE]: {
    appErrorTitle: "package.json bin 配置缺失",
    buildAppErrorMessage(): string {
      return "package.json 中缺少 bin 配置。"
    },
  },
  [AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE]: {
    appErrorTitle: "package.json 语法错误",
    buildAppErrorMessage(): string {
      return "package.json JSON 语法不正确。"
    },
  },
  [AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE]: {
    appErrorTitle: "package.json 结构不合法",
    buildAppErrorMessage(): string {
      return "package.json 内容不符合预期结构。"
    },
  },
  [AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE]: {
    appErrorTitle: "package.json 未找到",
    buildAppErrorMessage(): string {
      return "未找到 package.json。"
    },
  },
  [AppErrorCode.PLATFORM_NOT_FOUND_CODE]: {
    appErrorTitle: "平台不存在",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.PLATFORM_NOT_FOUND_CODE },
        })
      }
      return `以下平台不存在：${appErrorParam.platformNameList.join("、")}。`
    },
  },
  [AppErrorCode.REMOTE_REPOSITORY_DOWNLOAD_FAILED_CODE]: {
    appErrorTitle: "下载远程仓库失败",
    buildAppErrorMessage(): string {
      return "下载远程仓库失败，请检查网络后重试。"
    },
  },
  [AppErrorCode.REMOTE_SKILL_EMPTY_CODE]: {
    appErrorTitle: "远端技能为空",
    buildAppErrorMessage(): string {
      return "远端仓库中没有可安装的技能。"
    },
  },
  [AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE]: {
    appErrorTitle: "远端技能不存在",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_NOT_FOUND_CODE },
        })
      }
      const skillNameList = appErrorParam.skillNameList

      if (skillNameList.length === 1) {
        return `远端技能"${skillNameList[0]}"不存在。`
      }

      return `以下远端技能不存在：${skillNameList.join("、")}。`
    },
  },
  [AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE]: {
    appErrorTitle: "远端技能条目不合法",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_ENTRY_INVALID_CODE },
        })
      }
      return `远端技能条目"${appErrorParam.skillEntryFilePath}"不符合预期结构。`
    },
  },
  [AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE]: {
    appErrorTitle: "远端技能条目缺失",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_ENTRY_MISSING_CODE },
        })
      }
      return `远端技能条目"${appErrorParam.skillEntryFilePath}"未找到。`
    },
  },
  [AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE]: {
    appErrorTitle: "远端技能目录不可读",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.REMOTE_SKILL_DIRECTORY_INVALID_CODE },
        })
      }
      return `远端技能目录"${appErrorParam.remoteSkillDirectoryPath}"读取失败。`
    },
  },
  [AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE]: {
    appErrorTitle: "平台技能目录不可读",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.PLATFORM_SKILL_DIRECTORY_INVALID_CODE },
        })
      }
      return `平台"${appErrorParam.platformName}"的技能目录"${appErrorParam.platformSkillDirectoryPath}"读取失败。`
    },
  },
  [AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE]: {
    appErrorTitle: "参数错误",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE },
        })
      }
      return `技能选项"${appErrorParam.rawSkillNameText}"格式不正确，应类似 yeizi-skill 或 yeizi-skill-1,yeizi-skill-2（多个技能用英文逗号分隔）。`
    },
  },
  [AppErrorCode.SKILL_ADD_FAILED_CODE]: {
    appErrorTitle: "技能添加失败",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.SKILL_ADD_FAILED_CODE },
        })
      }
      return `从"${appErrorParam.sourceDirectoryPath}"添加到"${appErrorParam.targetDirectoryPath}"失败。`
    },
  },
  [AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE]: {
    appErrorTitle: "删除目录失败",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE },
        })
      }
      return `删除目录"${appErrorParam.directoryPath}"失败。`
    },
  },
  [AppErrorCode.PROMPT_CANCELLED_CODE]: {
    appErrorTitle: "已取消操作",
    buildAppErrorMessage(): string {
      return "已取消本次操作。"
    },
  },
  [AppErrorCode.LOCAL_SKILL_EMPTY_CODE]: {
    appErrorTitle: "本地技能为空",
    buildAppErrorMessage(): string {
      return "当前本地平台上没有已安装的技能。"
    },
  },
  [AppErrorCode.LOCAL_SKILL_NOT_FOUND_CODE]: {
    appErrorTitle: "本地技能不存在",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        throw new AppError(AppErrorCode.APP_ERROR_PARAM_MISSING_CODE, {
          param: { appErrorCode: AppErrorCode.LOCAL_SKILL_NOT_FOUND_CODE },
        })
      }
      const skillNameList = appErrorParam.skillNameList

      if (skillNameList.length === 1) {
        return `技能"${skillNameList[0]}"未在本地添加。`
      }

      return `以下技能未在本地添加：${skillNameList.join("、")}。`
    },
  },
  [AppErrorCode.REMOTE_REPOSITORY_NOT_LOADED_CODE]: {
    appErrorTitle: "远端仓库尚未加载",
    buildAppErrorMessage(): string {
      return "远端仓库本地目录路径尚未加载完成。"
    },
  },
  [AppErrorCode.REMOTE_SKILL_LIST_NOT_LOADED_CODE]: {
    appErrorTitle: "远端技能列表尚未加载",
    buildAppErrorMessage(): string {
      return "远端技能列表尚未加载完成。"
    },
  },
  [AppErrorCode.LOCAL_PLATFORM_LIST_NOT_LOADED_CODE]: {
    appErrorTitle: "本地平台列表尚未加载",
    buildAppErrorMessage(): string {
      return "本地平台列表尚未加载完成。"
    },
  },
  [AppErrorCode.APP_ERROR_PARAM_MISSING_CODE]: {
    appErrorTitle: "错误参数缺失",
    buildAppErrorMessage(appErrorParam): string {
      if (appErrorParam === undefined) {
        return "错误码构造时缺少必填 param 参数。"
      }
      return `错误码"${appErrorParam.appErrorCode}"构造时缺少必填 param 参数。`
    },
  },
}

/**
 * 按错误码取出对应的错误信息。
 *
 * @param appErrorCode - 错误码字面量。
 * @returns 对应错误码的错误定义对象
 *
 * @example
 * ```typescript
 * const definition = getAppErrorDefinition(AppErrorCode.PLATFORM_NOT_FOUND_CODE) // { appErrorTitle: "平台不存在", buildAppErrorMessage: [Function] }
 * definition.buildAppErrorMessage({ platformNameList: ["vscode"] }) // "以下平台不存在：vscode。"
 * ```
 */
function getAppErrorDefinition<T extends AppErrorCodeType>(appErrorCode: T): AppErrorDefinition<T> {
  return appErrorDefinitionMap[appErrorCode]
}

export { getAppErrorDefinition }
