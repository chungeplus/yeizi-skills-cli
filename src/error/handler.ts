import type { CommanderError } from "commander"
import type {
  CommanderErrorCodeType,
  CommanderErrorToAppErrorMap,
  ExcessArgumentCountInfo,
} from "@/types/error"

import { AppError } from "./app"
import { AppErrorCode, COMMANDER_HELP_DISPLAYED_CODE, CommanderErrorCode } from "./code"

/**
 * 从 Commander 错误信息中提取第一个单引号包裹的字面量值。
 *
 * @param errorMessageText - Commander 错误信息原文
 * @returns 第一个单引号包裹的子串
 * @throws AppError (AppErrorCode.UNEXPECTED_ERROR_CODE) - 当原文未包含单引号包裹的值时
 *
 * @example
 * ```typescript
 * const quotedValue = parseQuotedValue("Unknown command: 'foo'.") // "foo"
 * parseQuotedValue("plain error") // throws AppError
 * ```
 */
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

/**
 * 从多余参数错误信息中解析期望与实际的参数个数。
 *
 * @param errorMessageText - Commander 错误信息原文
 * @returns 参数数量信息
 * @throws AppError (AppErrorCode.UNEXPECTED_ERROR_CODE) - 当文本不符合 "Expected N arguments? but got M." 格式时
 *
 * @example
 * ```typescript
 * const info = parseExcessArgumentCountInfo("Expected 2 arguments but got 3.") // { expectedCount: "2", actualCount: "3" }
 * ```
 */
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

/**
 * 字符串是否属于 Commander 已知错误码的取值。
 *
 * @param code - 任意字符串
 * @returns 判定结果
 *
 * @example
 * ```typescript
 * const isKnownCode = isCommanderErrorCodeType("commander.unknownCommand") // true
 * const isUnknownCode = isCommanderErrorCodeType("not-a-code") // false
 * ```
 */
function isCommanderErrorCodeType(code: string): code is CommanderErrorCodeType {
  const commanderErrorCodeList: string[] = Object.values(CommanderErrorCode)
  return commanderErrorCodeList.includes(code)
}

/**
 * Commander 错误码 → AppError 构造函数的映射表。
 */
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

/**
 * 把 Commander 错误转换为对应的 AppError 并抛出。
 *
 * @param error - CommanderError 实例
 *
 * @throws AppError (AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE) - 当 Commander 输出 --help 时
 * @throws AppError (AppErrorCode.COMMANDER_NORMAL_EXIT_CODE) - 当 Commander 以 exitCode 0 正常结束时
 * @throws AppError (AppErrorCode.COMMANDER_UNKNOWN_COMMAND_CODE) - 当命令名不存在时
 * @throws AppError (AppErrorCode.COMMANDER_UNKNOWN_OPTION_CODE) - 当选项名不受支持时
 * @throws AppError (AppErrorCode.COMMANDER_OPTION_MISSING_ARGUMENT_CODE) - 当选项缺少参数值时
 * @throws AppError (AppErrorCode.COMMANDER_MANDATORY_OPTION_VALUE_MISSING_CODE) - 当缺少必填选项的值时
 * @throws AppError (AppErrorCode.COMMANDER_MISSING_ARGUMENT_CODE) - 当缺少必填参数时
 * @throws AppError (AppErrorCode.COMMANDER_EXCESS_ARGUMENTS_CODE) - 当命令参数过多时
 * @throws AppError (AppErrorCode.UNEXPECTED_ERROR_CODE) - 当 CommanderError.code 不在已知集合中，或错误消息格式异常时
 */
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
