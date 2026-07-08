import type { CommanderError } from "commander"

/**
 * 多余参数错误携带的数量信息。字段为 `string` 而非 `number`。
 */
interface ExcessArgumentCountInfo {
  /**
   * 期望的参数数量。
   */
  expectedCount: string

  /**
   * 实际收到的参数数量。
   */
  actualCount: string
}

/**
 * Commander 内置错误码。
 */
type CommanderErrorCodeType
  = | "commander.unknownCommand"
    | "commander.unknownOption"
    | "commander.optionMissingArgument"
    | "commander.missingMandatoryOptionValue"
    | "commander.missingArgument"
    | "commander.excessArguments"

/**
 * 错误码 → 应用错误转换函数映射。
 */
type CommanderErrorToAppErrorMap = {
  [K in CommanderErrorCodeType]: (error: CommanderError) => Error
}

export type {
  CommanderErrorCodeType,
  CommanderErrorToAppErrorMap,
  ExcessArgumentCountInfo,
}
