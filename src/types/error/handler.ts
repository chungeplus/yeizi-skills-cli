import type { CommanderError } from "commander"

interface ExcessArgumentCountInfo {
  expectedCount: string
  actualCount: string
}

type CommanderErrorCodeType
  = | "commander.unknownCommand"
    | "commander.unknownOption"
    | "commander.optionMissingArgument"
    | "commander.missingMandatoryOptionValue"
    | "commander.missingArgument"
    | "commander.excessArguments"

type CommanderErrorToAppErrorMap = {
  [K in CommanderErrorCodeType]: (error: CommanderError) => Error
}

export type {
  CommanderErrorCodeType,
  CommanderErrorToAppErrorMap,
  ExcessArgumentCountInfo,
}
