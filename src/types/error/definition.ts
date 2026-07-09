import type { AppErrorParam } from "./app"
import type { AppErrorCodeType } from "./code"

/**
 * 单个错误码的展示层定义。
 */
interface AppErrorDefinition<T extends AppErrorCodeType = AppErrorCodeType> {
  /**
   * 错误短标题。
   */
  appErrorTitle: string

  /**
   * 拼装错误消息。
   */
  buildAppErrorMessage: (appErrorParam?: AppErrorParam<T>) => string
}

/**
 * 全部错误码 → 展示层定义的映射类型。
 */
type AppErrorDefinitionMap = {
  [K in AppErrorCodeType]: AppErrorDefinition<K>
}

export type {
  AppErrorDefinition,
  AppErrorDefinitionMap,
}
