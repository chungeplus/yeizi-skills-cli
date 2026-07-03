import type { CommanderError } from "commander"

type CommanderMessageMap = Map<string, (error: CommanderError) => string>

type ErrorMap = Map<string, (error: Error) => string>

export type { CommanderMessageMap, ErrorMap }
