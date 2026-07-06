import type {
  AppErrorCodeType,
  AppErrorDefinition,
  AppErrorDefinitionMap,
  AppErrorParam,
} from "@/types/error"
import { AppErrorCode } from "./code"

const errorDefinitionMap: AppErrorDefinitionMap = new Map([
  [AppErrorCode.COMMANDER_NORMAL_EXIT_CODE, {
    appErrorTitle: "命令已结束",
    buildAppErrorMessage(): string {
      return "命令已正常结束。"
    },
  }],
  [AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE, {
    appErrorTitle: "已显示帮助",
    buildAppErrorMessage(): string {
      return "已显示帮助信息。"
    },
  }],
  [AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE, {
    appErrorTitle: "命令不存在",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE, {
    appErrorTitle: "选项不受支持",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE, {
    appErrorTitle: "选项缺少参数值",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_MISSING_MANDATORY_OPTION_VALUE_CODE, {
    appErrorTitle: "缺少必填选项值",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_MISSING_MANDATORY_OPTION_VALUE_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE, {
    appErrorTitle: "缺少必填参数",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE, {
    appErrorTitle: "命令参数过多",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_QUOTED_VALUE_MISSING_CODE, {
    appErrorTitle: "命令解析错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_QUOTED_VALUE_MISSING_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_MESSAGE_INVALID_CODE, {
    appErrorTitle: "命令解析错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_MESSAGE_INVALID_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.COMMANDER_CODE_UNSUPPORTED_CODE, {
    appErrorTitle: "命令解析错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.COMMANDER_CODE_UNSUPPORTED_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.UNEXPECTED_ERROR_CODE, {
    appErrorTitle: "程序异常",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.UNEXPECTED_ERROR_CODE>): string {
      return appErrorParam.detailMessage
    },
  }],
  [AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "package.json 中缺少 bin 配置。"
    },
  }],
  [AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "package.json JSON 语法不正确。"
    },
  }],
  [AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "package.json 内容不符合预期结构。"
    },
  }],
  [AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE, {
    appErrorTitle: "程序配置错误",
    buildAppErrorMessage() {
      return "未找到 package.json。"
    },
  }],
  [AppErrorCode.PLATFORM_NOT_FOUND_CODE, {
    appErrorTitle: "平台不存在",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.PLATFORM_NOT_FOUND_CODE>) {
      return `以下平台不存在：${appErrorParam.platformNameList.join("、")}。`
    },
  }],
  [AppErrorCode.REMOTE_REPOSITORY_PULL_FAILED_CODE, {
    appErrorTitle: "拉取远程仓库失败",
    buildAppErrorMessage() {
      return "拉取远程仓库失败，请检查网络后重试。"
    },
  }],
  [AppErrorCode.REMOTE_SKILL_EMPTY_CODE, {
    appErrorTitle: "远端技能为空",
    buildAppErrorMessage() {
      return "远端仓库中没有可安装的技能。"
    },
  }],
  [AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE, {
    appErrorTitle: "参数错误",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.SKILL_OPTION_INVALID_FORMAT_CODE>) {
      return `技能选项"${appErrorParam.rawSkillNameText}"格式不正确，应类似 yeizi-skill 或 yeizi-skill-1,yeizi-skill-2（多个技能用英文逗号分隔）。`
    },
  }],
  [AppErrorCode.SKILL_NOT_FOUND_CODE, {
    appErrorTitle: "技能不存在",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.SKILL_NOT_FOUND_CODE>) {
      const skillNameList = appErrorParam.skillNameList

      if (skillNameList.length === 1) {
        return `技能"${skillNameList[0]}"不存在。`
      }

      return `以下技能不存在：${skillNameList.join("、")}。`
    },
  }],
  [AppErrorCode.FILE_COPY_FAILED_CODE, {
    appErrorTitle: "文件复制失败",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.FILE_COPY_FAILED_CODE>) {
      return `从"${appErrorParam.sourcePath}"复制到"${appErrorParam.targetPath}"失败。`
    },
  }],
  [AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE, {
    appErrorTitle: "删除目录失败",
    buildAppErrorMessage(appErrorParam: AppErrorParam<typeof AppErrorCode.DIRECTORY_REMOVE_FAILED_CODE>) {
      return `删除临时目录"${appErrorParam.directoryPath}"失败。`
    },
  }],
  [AppErrorCode.PROMPT_CANCELLED_CODE, {
    appErrorTitle: "已取消操作",
    buildAppErrorMessage() {
      return "已取消本次操作。"
    },
  }],
])

function getErrorDefinition<T extends AppErrorCodeType>(code: T): AppErrorDefinition<T> {
  const errorDefinition = errorDefinitionMap.get(code)!

  return errorDefinition as AppErrorDefinition<T>
}

export { getErrorDefinition }
