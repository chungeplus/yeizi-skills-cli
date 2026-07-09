import type { AppErrorCodeType, AppErrorOption } from "@/types/error"
import { getAppErrorDefinition } from "./definition"

/**
 * 应用统一错误类型。
 */
class AppError<T extends AppErrorCodeType = AppErrorCodeType> extends Error {
  /**
   * 对应错误码字面量，用于在错误处理分支中做等值判断。
   */
  public appErrorCode: T

  /**
   * 错误短标题。
   */
  public appErrorTitle: string

  /**
   * 按错误码构造应用错误实例，自动填充标题与消息。
   *
   * @param appErrorCode - 错误码字面量。
   * @param appErrorOption - 错误参数载荷。
   */
  public constructor(appErrorCode: T, appErrorOption?: AppErrorOption<T>) {
    const definition = getAppErrorDefinition(appErrorCode)

    super(definition.buildAppErrorMessage(appErrorOption?.param))

    this.name = new.target.name
    this.appErrorCode = appErrorCode
    this.appErrorTitle = definition.appErrorTitle
  }
}

export { AppError }
