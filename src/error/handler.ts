import type { AppErrorCodeType, CommanderMessageMap, ErrorMap } from "@/types/error"
import process from "node:process"

import { CommanderError } from "commander"
import { renderErrorDisplay } from "@/features/display"

import { AppError } from "./app"
import { AppErrorCode } from "./code"

function extractQuotedValue(errorMessageText: string): string | null {
  const matchedResult = errorMessageText.match(/'([^']+)'/)
  if (matchedResult === null) {
    return null
  }

  return matchedResult[1]
}

function getCommanderErrorMessage(error: CommanderError): string {
  const commanderMessageMap: CommanderMessageMap = new Map([
    ["commander.unknownCommand", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)

      if (quotedValue === null) {
        return "未知命令错误。"
      }

      return `命令“${quotedValue}”不存在，请使用 --help 查看可用命令。`
    }],
    ["commander.unknownOption", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)

      if (quotedValue === null) {
        return "未知选项错误。"
      }

      return `选项“${quotedValue}”不受支持，请使用 --help 查看可用选项。`
    }],
    ["commander.optionMissingArgument", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)

      if (quotedValue === null) {
        return "未知选项缺少参数值。"
      }

      return `选项“${quotedValue}”缺少参数值。`
    }],
    ["commander.missingMandatoryOptionValue", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)

      if (quotedValue === null) {
        return "缺少必填选项值。"
      }

      return `缺少必填选项“${quotedValue}”。`
    }],
    ["commander.missingArgument", (currentError: CommanderError) => {
      const quotedValue = extractQuotedValue(currentError.message)

      if (quotedValue === null) {
        return "缺少必填参数。"
      }

      return `缺少必填参数“${quotedValue}”。`
    }],
    ["commander.excessArguments", (currentError: CommanderError) => {
      const matchedResult = currentError.message.match(/Expected (\d+) arguments? but got (\d+)\./)

      if (matchedResult === null) {
        return "命令参数过多，请使用 --help 查看正确用法。"
      }

      return `命令参数过多，期望 ${matchedResult[1]} 个，实际收到 ${matchedResult[2]} 个。`
    }],
  ])

  const commanderErrorMessageBuilder = commanderMessageMap.get(error.code)

  if (commanderErrorMessageBuilder !== undefined) {
    return commanderErrorMessageBuilder(error)
  }

  return "命令参数不正确，请使用 --help 查看正确用法。"
}

function getErrorMessage(error: Error): string {
  const errorMessageMap: ErrorMap = new Map([
    ["ExitPromptError", () => {
      return "用户取消了提示。"
    }],
  ])

  const errorMessageBuilder = errorMessageMap.get(error.name)

  if (errorMessageBuilder !== undefined) {
    return errorMessageBuilder(error)
  }

  return "未知错误"
}

function isAppError(error: Error): error is AppError<AppErrorCodeType> {
  return error instanceof AppError
}

function isCommanderError(error: Error): error is CommanderError {
  return error instanceof CommanderError
}

function isError(error: Error): error is Error {
  return error instanceof Error
}

function isPromptCancelledError(error: Error): boolean {
  return error.name === "ExitPromptError"
}

function wrapAsFatalAppError(error: Error): AppError<AppErrorCodeType> {
  if (isAppError(error)) {
    return error
  }

  if (isCommanderError(error)) {
    return new AppError(AppErrorCode.CLI_USAGE_INVALID, {
      param: {
        detailMessage: getCommanderErrorMessage(error),
      },
      cause: error,
    })
  }

  if (isError(error) && isPromptCancelledError(error)) {
    return new AppError(AppErrorCode.PROMPT_CANCELLED, {
      cause: error,
    })
  }

  if (isError(error)) {
    return new AppError(AppErrorCode.SYSTEM_ERROR, {
      param: {
        detailMessage: getErrorMessage(error),
      },
      cause: error,
    })
  }

  return new AppError(AppErrorCode.UNEXPECTED_ERROR, {
    cause: error,
  })
}

function handleFatalError(error: Error): void {
  const fatalError = wrapAsFatalAppError(error)

  renderErrorDisplay(fatalError.appErrorTitle, fatalError.message)
  process.exitCode = 1
}

export { handleFatalError, wrapAsFatalAppError }
