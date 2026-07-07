import type { AppErrorCodeType, AppErrorOption } from "@/types/error"
import { getAppErrorDefinition } from "./definition"

class AppError<T extends AppErrorCodeType = AppErrorCodeType> extends Error {
  public appErrorCode: T

  public appErrorTitle: string

  public constructor(appErrorCode: T, appErrorOption?: AppErrorOption<T>) {
    const appErrorParam = appErrorOption?.param

    const definition = getAppErrorDefinition(appErrorCode)

    super(definition.buildAppErrorMessage(appErrorParam!))

    this.name = new.target.name
    this.appErrorCode = appErrorCode
    this.appErrorTitle = definition.appErrorTitle
  }
}

export { AppError }
