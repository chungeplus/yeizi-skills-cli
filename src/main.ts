import process from "node:process"

import { Command, CommanderError } from "commander"

import { InstallCommand } from "@/commands/install"
import { ListCommand } from "@/commands/list"
import { AppError, AppErrorCode, handleFatalError } from "@/error"
import { loadPackageJson } from "@/features/json"

const HELP_DISPLAYED_ERROR_CODE = "commander.help"

async function createProgram(): Promise<Command> {
  const packageJsonInfo = loadPackageJson()
  const programNameList = Object.keys(packageJsonInfo.bin)

  if (programNameList.length === 0) {
    throw new AppError(AppErrorCode.PACKAGE_BIN_CONFIG_MISSING)
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

    await program.parseAsync(process.argv)
  }
  catch (error) {
    if (error instanceof CommanderError) {
      if (error.exitCode === 0) {
        process.exitCode = error.exitCode
        return
      }
      if (error.code === HELP_DISPLAYED_ERROR_CODE) {
        process.exitCode = 0
        return
      }
    }

    if (error instanceof Error) {
      handleFatalError(error)
    }
  }
}

export { runCli }
