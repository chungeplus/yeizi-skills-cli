import type { PackageJson } from "@/types/json/package"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

import { fileURLToPath } from "node:url"
import { ZodError } from "zod"
import { AppError, AppErrorCode } from "@/error"
import { packageJsonSchema } from "@/schemas/json"

function loadPackageJson(): PackageJson {
  const packageJsonPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "package.json",
  )

  try {
    const rawPackageJsonText = readFileSync(packageJsonPath, "utf8")

    return packageJsonSchema.parse(JSON.parse(rawPackageJsonText))
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError(AppErrorCode.PACKAGE_CONFIG_INVALID_FORMAT, {
        cause: error,
      })
    }

    if (error instanceof ZodError) {
      throw new AppError(AppErrorCode.PACKAGE_CONFIG_INVALID_FORMAT, {
        cause: error,
      })
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ENOENT") {
        throw new AppError(AppErrorCode.PACKAGE_CONFIG_NOT_FOUND, {
          cause: error,
        })
      }
    }

    throw error
  }
}

export { loadPackageJson }
