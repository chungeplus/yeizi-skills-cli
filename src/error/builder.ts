import { AppError } from "./app"
import { AppErrorCode } from "./code"

function isAppError(error: Error): error is AppError {
  return error instanceof AppError
}

function buildAppError(error: Error): AppError {
  if (isAppError(error)) {
    return error
  }

  return new AppError(AppErrorCode.UNEXPECTED_ERROR_CODE, {
    param: {
      detailMessage: `捕获到非 Error 异常，异常值类型为 ${typeof error}。`,
    },
  })
}

export { buildAppError }
