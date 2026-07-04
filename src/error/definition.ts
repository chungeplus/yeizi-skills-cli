import type {
  AppErrorCodeType,
  AppErrorDefinition,
  AppErrorDefinitionMap,
  AppErrorParam,
} from "@/types/error"
import { AppError } from "./app"
import { AppErrorCode } from "./code"

const errorDefinitionMap: AppErrorDefinitionMap = new Map([
  [AppErrorCode.UNEXPECTED_ERROR, {
    appErrorTitle: "程序异常",
    buildAppErrorMessage() {
      return "程序执行失败，请稍后重试。如果反复出现，请到 https://github.com/chungeplus/yeizi-skills/issues 反馈（附上报错时的命令与堆栈）。"
    },
  }],
  [AppErrorCode.SYSTEM_ERROR, {
    appErrorTitle: "系统错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("detailMessage" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "SYSTEM_ERROR 缺少 detailMessage。",
          },
        })
      }

      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.APP_ERROR_INVALID, {
    appErrorTitle: "程序内部错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("detailMessage" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "AppError 参数不合法。",
          },
        })
      }

      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.CLI_USAGE_INVALID, {
    appErrorTitle: "命令用法错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("detailMessage" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "CLI_USAGE_INVALID 缺少 detailMessage。",
          },
        })
      }

      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.PACKAGE_BIN_CONFIG_MISSING, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "package.json 中缺少 bin 配置。"
    },
  }],
  [AppErrorCode.PACKAGE_CONFIG_INVALID_FORMAT, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "package.json 配置格式不正确。"
    },
  }],
  [AppErrorCode.PACKAGE_CONFIG_NOT_FOUND, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "未找到 package.json。"
    },
  }],
  [AppErrorCode.PLATFORM_NOT_SUPPORTED, {
    appErrorTitle: "平台不受支持",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("platformName" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "PLATFORM_NOT_SUPPORTED 缺少 platformName。",
          },
        })
      }

      return `平台"${appErrorParam.platformName}"不受支持。`
    },
  }],
  [AppErrorCode.PLATFORM_NOT_FOUND, {
    appErrorTitle: "平台不存在",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("platformNameList" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "PLATFORM_NOT_FOUND 缺少 platformNameList。",
          },
        })
      }

      return `以下平台不存在：${appErrorParam.platformNameList.join("、")}。`
    },
  }],
  [AppErrorCode.REMOTE_REPOSITORY_PULL_FAILED, {
    appErrorTitle: "拉取远程仓库失败",
    buildAppErrorMessage() {
      return "拉取远程仓库失败，请检查网络后重试。"
    },
  }],
  [AppErrorCode.REMOTE_SKILL_EMPTY, {
    appErrorTitle: "远端技能为空",
    buildAppErrorMessage() {
      return "远端仓库中没有可安装的技能。"
    },
  }],
  [AppErrorCode.SKILL_OPTION_INVALID_FORMAT, {
    appErrorTitle: "参数错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("rawSkillNameText" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "SKILL_OPTION_INVALID_FORMAT 缺少 rawSkillNameText。",
          },
        })
      }

      return `技能选项"${appErrorParam.rawSkillNameText}"格式不正确，应类似 yeizi-skill 或 yeizi-skill-1,yeizi-skill-2（多个技能用英文逗号分隔）。`
    },
  }],
  [AppErrorCode.SKILL_NOT_FOUND, {
    appErrorTitle: "技能不存在",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("skillNameList" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "SKILL_NOT_FOUND 缺少 skillNameList。",
          },
        })
      }

      const skillNameList = appErrorParam.skillNameList

      if (skillNameList.length === 1) {
        return `技能"${skillNameList[0]}"不存在。`
      }

      return `以下技能不存在：${skillNameList.join("、")}。`
    },
  }],
  [AppErrorCode.PROMPT_CANCELLED, {
    appErrorTitle: "已取消操作",
    buildAppErrorMessage() {
      return "已取消本次操作。"
    },
  }],
  [AppErrorCode.FILE_COPY_FAILED, {
    appErrorTitle: "文件复制失败",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (
        appErrorParam === undefined
        || !("sourcePath" in appErrorParam)
        || !("targetPath" in appErrorParam)
      ) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "FILE_COPY_FAILED 缺少 sourcePath 或 targetPath。",
          },
        })
      }

      return `从"${appErrorParam.sourcePath}"复制到"${appErrorParam.targetPath}"失败。`
    },
  }],
  [AppErrorCode.DIRECTORY_REMOVE_FAILED, {
    appErrorTitle: "删除目录失败",
    buildAppErrorMessage(appErrorParam: AppErrorParam<AppErrorCodeType> | undefined) {
      if (appErrorParam === undefined || !("directoryPath" in appErrorParam)) {
        throw new AppError(AppErrorCode.APP_ERROR_INVALID, {
          param: {
            detailMessage: "DIRECTORY_REMOVE_FAILED 缺少 directoryPath。",
          },
        })
      }

      return `删除临时目录"${appErrorParam.directoryPath}"失败。`
    },
  }],
])

function getErrorDefinition(code: AppErrorCodeType): AppErrorDefinition<AppErrorCodeType> {
  const errorDefinition = errorDefinitionMap.get(code)

  if (errorDefinition !== undefined) {
    return errorDefinition
  }

  return errorDefinitionMap.get(AppErrorCode.APP_ERROR_INVALID)!
}

export { errorDefinitionMap, getErrorDefinition }
