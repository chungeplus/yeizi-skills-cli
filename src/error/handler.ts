import type { CommanderError } from "commander"
import type {
  CommanderErrorCodeType,
  CommanderErrorToAppErrorMap,
  ExcessArgumentCountInfo,
} from "@/types/error"

import { AppError } from "./app"
import { AppErrorCode, COMMANDER_HELP_DISPLAYED_CODE, CommanderErrorCode } from "./code"

function parseQuotedValue(errorMessageText: string): string {
  const matchedResult = errorMessageText.match(/'([^']+)'/)

  if (matchedResult === null) {
    throw new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `CommanderError.message 未包含引号包裹的值：${errorMessageText}`,
      },
    })
  }

  return matchedResult[1]
}

function parseExcessArgumentCountInfo(errorMessageText: string): ExcessArgumentCountInfo {
  const matchedResult = errorMessageText.match(/Expected (\d+) arguments? but got (\d+)\./)

  if (matchedResult === null) {
    throw new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `CommanderError.message 不符合 excessArguments 预期格式：${errorMessageText}`,
      },
    })
  }

  const [, expectedCount, actualCount] = matchedResult

  return { expectedCount, actualCount }
}

function isCommanderErrorCodeType(code: string): code is CommanderErrorCodeType {
  const commanderErrorCodeList: string[] = Object.values(CommanderErrorCode)
  return commanderErrorCodeList.includes(code)
}

const commanderErrorToAppErrorMap: CommanderErrorToAppErrorMap = {
  [CommanderErrorCode.UNKNOWN_COMMAND_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message)
    return new AppError(AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE, {
      param: {
        detailMessage: `命令"${quotedValue}"不存在，请使用 --help 查看可用命令。`,
      },
    })
  },
  [CommanderErrorCode.UNKNOWN_OPTION_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message)
    return new AppError(AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE, {
      param: {
        detailMessage: `选项"${quotedValue}"不受支持，请使用 --help 查看可用选项。`,
      },
    })
  },
  [CommanderErrorCode.OPTION_MISSING_ARGUMENT_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message)
    return new AppError(AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE, {
      param: {
        detailMessage: `选项"${quotedValue}"缺少参数值。`,
      },
    })
  },
  [CommanderErrorCode.MISSING_MANDATORY_OPTION_VALUE_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message)
    return new AppError(AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE, {
      param: {
        detailMessage: `缺少必填选项"${quotedValue}"。`,
      },
    })
  },
  [CommanderErrorCode.MISSING_ARGUMENT_CODE]: (error) => {
    const quotedValue = parseQuotedValue(error.message)
    return new AppError(AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE, {
      param: {
        detailMessage: `缺少必填参数"${quotedValue}"。`,
      },
    })
  },
  [CommanderErrorCode.EXCESS_ARGUMENTS_CODE]: (error) => {
    const { expectedCount, actualCount } = parseExcessArgumentCountInfo(error.message)
    return new AppError(AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE, {
      param: {
        detailMessage: `命令参数过多，期望 ${expectedCount} 个，实际收到 ${actualCount} 个。`,
      },
    })
  },
}

function buildAppErrorFromCommanderError(error: CommanderError): never {
  if (error.code === COMMANDER_HELP_DISPLAYED_CODE) {
    throw new AppError(AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE)
  }

  if (error.exitCode === 0) {
    throw new AppError(AppErrorCode.COMMANDER_NORMAL_EXIT_CODE)
  }

  if (!isCommanderErrorCodeType(error.code)) {
    throw new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `未支持的 CommanderError.code：${error.code}`,
      },
    })
  }

  throw commanderErrorToAppErrorMap[error.code](error)
}

export { buildAppErrorFromCommanderError }
