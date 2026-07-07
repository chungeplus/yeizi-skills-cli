import type { AppErrorParam } from "./app"
import type { AppErrorCodeType } from "./code"

interface AppErrorDefinition<T extends AppErrorCodeType = AppErrorCodeType> {
  appErrorTitle: string
  buildAppErrorMessage: (appErrorParam: AppErrorParam<T>) => string
}

type AppErrorDefinitionMap = {
  [K in AppErrorCodeType]: AppErrorDefinition<K>
}

export type {
  AppErrorDefinition,
  AppErrorDefinitionMap,
}
