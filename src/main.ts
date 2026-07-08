import type { AppErrorCodeType } from "@/types/error"

import process from "node:process"

import { Command, CommanderError } from "commander"
import { AddCommand } from "@/commands/add"
import { ListCommand } from "@/commands/list"
import { AppError, AppErrorCode, buildAppErrorFromCommanderError } from "@/error"
import { renderErrorDisplay } from "@/features/display"
import { loadPackageJson } from "@/features/json"

/**
 * 静默退出的 AppError 码集合。
 */
const SILENT_EXIT_APP_ERROR_CODE_LIST: AppErrorCodeType[] = [
  AppErrorCode.COMMANDER_NORMAL_EXIT_CODE,
  AppErrorCode.COMMANDER_HELP_DISPLAYED_CODE,
  AppErrorCode.PROMPT_CANCELLED_CODE,
]

/**
 * 构造 CLI 程序实例。
 *
 * @returns 构造完成的 Commander Command 实例
 * @throws AppError (AppErrorCode.PACKAGE_BIN_CONFIG_MISSING_CODE) - 当 package.json.bin 为空时
 * @throws AppError (AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE) - 当 package.json 不是合法 JSON 时
 * @throws AppError (AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE) - 当 package.json 结构不符合 schema 时
 * @throws AppError (AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE) - 当 package.json 不存在时
 */
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

/**
 * 判定一个 Error 是否为 AppError。
 *
 * @param error - 任意 Error 实例
 * @returns 判定结果
 */
function isAppError(error: Error): error is AppError {
  return error instanceof AppError
}

/**
 * 运行 CLI。
 */
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
