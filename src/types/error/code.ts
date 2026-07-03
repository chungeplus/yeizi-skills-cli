import { AppErrorCode } from "@/error/code"

type AppErrorCodeType = typeof AppErrorCode[keyof typeof AppErrorCode]

export type { AppErrorCodeType }
