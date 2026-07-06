import type { AppErrorCodeType, AppErrorParam } from "@/types/error"

interface AppErrorDefinition<T extends AppErrorCodeType = AppErrorCodeType> {
  appErrorTitle: string
  buildAppErrorMessage: (appErrorParam: AppErrorParam<T>) => string
}

type AppErrorDefinitionMapValue = {
  [K in AppErrorCodeType]: AppErrorDefinition<K>
}[AppErrorCodeType]

type AppErrorDefinitionMap = Map<AppErrorCodeType, AppErrorDefinitionMapValue>

export type {
  AppErrorDefinition,
  AppErrorDefinitionMap,
  AppErrorDefinitionMapValue,
}
