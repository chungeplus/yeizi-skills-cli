import type { AppErrorCodeType, AppErrorOption, AppErrorParam } from "@/types/error"
import { getErrorDefinition } from "@/error/definition"

class AppError<T extends AppErrorCodeType = AppErrorCodeType> extends Error {
  public readonly appErrorCode: T

  public readonly appErrorTitle: string

  public constructor(appErrorCode: T, appErrorOption?: AppErrorOption<T>) {
    const appErrorParam = appErrorOption?.param
    const appErrorCause = appErrorOption?.cause
    const baseMessage = AppError.buildMessage(appErrorCode, appErrorParam!)

    super(baseMessage, {
      cause: appErrorCause,
    })

    this.name = new.target.name
    this.appErrorCode = appErrorCode
    this.appErrorTitle = getErrorDefinition(appErrorCode).appErrorTitle
  }

  private static buildMessage<T extends AppErrorCodeType>(
    appErrorCode: T,
    appErrorParam: AppErrorParam<T>,
  ): string {
    const definition = getErrorDefinition(appErrorCode)

    return definition.buildAppErrorMessage(appErrorParam)
  }
}

export { AppError }
