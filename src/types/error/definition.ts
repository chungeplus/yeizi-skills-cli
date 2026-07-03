import type { AppErrorCodeType, AppErrorParam } from "@/types/error"

interface AppErrorDefinition<T extends AppErrorCodeType = AppErrorCodeType> {
  appErrorTitle: string
  buildAppErrorMessage: (appErrorParam: AppErrorParam<T> | undefined) => string
}

type AppErrorDefinitionMap = Map<AppErrorCodeType, AppErrorDefinition<AppErrorCodeType>>

export type {
  AppErrorDefinition,
  AppErrorDefinitionMap,
}
