import type { PackageJson } from "@/types/json"
import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

import { fileURLToPath } from "node:url"
import { ZodError } from "zod"
import { AppError, AppErrorCode } from "@/error"
import { packageJsonSchema } from "@/schemas/json"

async function loadPackageJson(): Promise<PackageJson> {
  const packageJsonPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "package.json",
  )

  try {
    const rawPackageJsonText = await readFile(packageJsonPath, "utf8")

    return packageJsonSchema.parse(JSON.parse(rawPackageJsonText))
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError(AppErrorCode.PACKAGE_CONFIG_JSON_INVALID_CODE)
    }

    if (error instanceof ZodError) {
      throw new AppError(AppErrorCode.PACKAGE_CONFIG_SCHEMA_INVALID_CODE)
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ENOENT") {
        throw new AppError(AppErrorCode.PACKAGE_CONFIG_NOT_FOUND_CODE)
      }
    }

    throw error
  }
}

export { loadPackageJson }
