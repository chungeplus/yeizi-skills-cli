import type { AppErrorCodeType } from "@/types/error"

import process from "node:process"

import { Command, CommanderError } from "commander"
import { AddCommand } from "@/commands/add"
import { ListCommand } from "@/commands/list"
import { AppError, AppErrorCode, buildAppErrorFromCommanderError } from "@/error"
import { renderErrorDisplay } from "@/features/display"
import { loadPackageJson } from "@/features/json"

const SILENT_EXIT_APP_ERROR_CODE_LIST: AppErrorCodeType[] = [
  AppErrorCode.COMMANDER_NORMAL_EXIT_CODE,
  AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE,
  AppErrorCode.PROMPT_CANCELLED_CODE,
]

async function createProgram(): Promise<Command> {
  const packageJsonInfo = await loadPackageJson()
  const programNameList = Object.keys(packageJsonInfo.bin)

  if (programNameList.length === 0) {
    throw new AppError(AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE)
  }

  const program = new Command()

  program.exitOverride()
  program.configureOutput({
    outputError: () => { },
  })
  program.name(programNameList[0])
  program.description(packageJsonInfo.description)
  program.version(packageJsonInfo.version)

  new ListCommand().register(program)
  new AddCommand().register(program)

  return program
}

function isAppError(error: Error): error is AppError {
  return error instanceof AppError
}

async function runCli(): Promise<void> {
  try {
    const program = await createProgram()

    try {
      await program.parseAsync(process.argv)
    }
    catch (error) {
      if (error instanceof CommanderError) {
        buildAppErrorFromCommanderError(error)
      }
      throw error
    }
  }
  catch (error) {
    if (error instanceof Error) {
      if (isAppError(error)) {
        if (SILENT_EXIT_APP_ERROR_CODE_LIST.includes(error.appErrorCode)) {
          process.exitCode = 0
          return
        }

        renderErrorDisplay(error.appErrorTitle, error.message)
        process.exitCode = 1
        return
      }
    }

    const fallbackAppError = new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
      param: {
        detailMessage: `捕获到非 Error 异常，异常值类型为 ${typeof error}。`,
      },
    })
    renderErrorDisplay(fallbackAppError.appErrorTitle, fallbackAppError.message)
    process.exitCode = 1
  }
}

export { runCli }
