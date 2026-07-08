import { cp, rm } from "node:fs/promises"

/**
 * 复制目录到目标路径。
 *
 * @param sourceDirectoryPath - 源目录绝对路径
 * @param targetDirectoryPath - 目标目录绝对路径
 *
 * @example
 * ```typescript
 * await copyDirectory("/src/skills/web", "/dst/skills/web") // 整棵复制到 /dst/skills/web（覆盖同名目标）
 * ```
 */
async function copyDirectory(sourceDirectoryPath: string, targetDirectoryPath: string): Promise<void> {
  await cp(sourceDirectoryPath, targetDirectoryPath, {
    recursive: true,
    force: true,
  })
}

/**
 * 删除目录及其全部内容。
 *
 * @param directoryPath - 目录绝对路径
 *
 * @example
 * ```typescript
 * await removeDirectory("/tmp/cache") // 删除 /tmp/cache 及其全部内容；目录不存在不报错
 * ```
 */
async function removeDirectory(directoryPath: string): Promise<void> {
  await rm(directoryPath, { force: true, recursive: true })
}

export { copyDirectory, removeDirectory }
