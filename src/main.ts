import process from "node:process"

import { Command, CommanderError } from "commander"

import { InstallCommand } from "@/commands/install"
import { ListCommand } from "@/commands/list"
import { AppError, AppErrorCode, handleCommanderErrorToAppError } from "@/error"
import { loadPackageJson } from "@/features/json"
import { renderErrorDisplay } from "./features/display"

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
  new InstallCommand().register(program)

  return program
}

async function runCli(): Promise<void> {
  try {
    const program = await createProgram()

    try {
      await program.parseAsync(process.argv)
    }
    catch (error) {
      if (error instanceof CommanderError) {
        handleCommanderErrorToAppError(error)
      }

      throw error
    }
  }
  catch (error) {
    if (error instanceof AppError) {
      if (error.appErrorCode === AppErrorCode.COMMANDER_NORMAL_EXIT_CODE) {
        process.exitCode = 0
        return
      }

      if (error.appErrorCode === AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE) {
        process.exitCode = 0
        return
      }

      if (error.appErrorCode === AppErrorCode.PROMPT_CANCELLED_CODE) {
        process.exitCode = 0
        return
      }
    }

    if (error instanceof AppError) {
      renderErrorDisplay(error.appErrorTitle, error.message)
      process.exitCode = 1
    }
    else {
      const fallbackAppError = new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
        param: {
          detailMessage: `捕获到非 Error 异常，异常值类型为 ${typeof error}。`,
        },
      })
      renderErrorDisplay(fallbackAppError.appErrorTitle, fallbackAppError.message)
      process.exitCode = 1
    }
  }
}

export { runCli }
