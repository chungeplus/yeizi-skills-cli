import { CommanderError } from "commander"

import { AppError } from "./app"
import { AppErrorCode } from "./code"

function extractQuotedValue(errorMessageText: string): string {
  const matchedResult = errorMessageText.match(/'([^']+)'/)

  if (matchedResult === null) {
    throw new AppError(AppErrorCode.COMMANDER_QUOTED_VALUE_MISSING_CODE, {
      param: {
        detailMessage: `CommanderError.message 未包含引号包裹的值：${errorMessageText}`,
      },
    })
  }

  return matchedResult[1]
}

function extractExcessArgumentCountList(errorMessageText: string): string[] {
  const matchedResult = errorMessageText.match(/Expected (\d+) arguments? but got (\d+)\./)

  if (matchedResult === null) {
    throw new AppError(AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_MESSAGE_INVALID_CODE, {
      param: {
        detailMessage: `CommanderError.message 不符合 excessArguments 预期格式：${errorMessageText}`,
      },
    })
  }

  return matchedResult
}

function handleCommanderErrorToAppError(error: CommanderError): never {
  if (error.code === "commander.help") {
    throw new AppError(AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE)
  }

  if (error.exitCode === 0) {
    throw new AppError(AppErrorCode.COMMANDER_NORMAL_EXIT_CODE)
  }

  const commanderErrorToAppErrorMap = new Map<string, (currentError: CommanderError) => AppError>([
    ["commander.unknownCommand", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)
      return new AppError(AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE, {
        param: {
          detailMessage: `命令"${quotedValue}"不存在，请使用 --help 查看可用命令。`,
        },
        cause: error,
      })
    }],
    ["commander.unknownOption", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)
      return new AppError(AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE, {
        param: {
          detailMessage: `选项"${quotedValue}"不受支持，请使用 --help 查看可用选项。`,
        },
        cause: error,
      })
    }],
    ["commander.optionMissingArgument", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)
      return new AppError(AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE, {
        param: {
          detailMessage: `选项"${quotedValue}"缺少参数值。`,
        },
        cause: error,
      })
    }],
    ["commander.missingMandatoryOptionValue", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)
      return new AppError(AppErrorCode.COMMANDER_MISSING_MANDATORY_OPTION_VALUE_CODE, {
        param: {
          detailMessage: `缺少必填选项"${quotedValue}"。`,
        },
        cause: error,
      })
    }],
    ["commander.missingArgument", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)
      return new AppError(AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE, {
        param: {
          detailMessage: `缺少必填参数"${quotedValue}"。`,
        },
        cause: error,
      })
    }],
    ["commander.excessArguments", (currentError: CommanderError) => {
      const matchedResult = extractExcessArgumentCountList(currentError.message)
      return new AppError(AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE, {
        param: {
          detailMessage: `命令参数过多，期望 ${matchedResult[1]} 个，实际收到 ${matchedResult[2]} 个。`,
        },
        cause: error,
      })
    }],
  ])

  const appErrorBuilder = commanderErrorToAppErrorMap.get(error.code)

  if (appErrorBuilder === undefined) {
    throw new AppError(AppErrorCode.COMMANDER_CODE_UNSUPPORTED_CODE, {
      param: {
        detailMessage: `未支持的 CommanderError.code：${error.code}`,
      },
    })
  }

  throw appErrorBuilder(error)
}
export { handleCommanderErrorToAppError }
