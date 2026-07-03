import { cp, rm } from "node:fs/promises"

async function copyDirectory(sourcePath: string, targetPath: string): Promise<void> {
  await cp(sourcePath, targetPath, {
    recursive: true,
    force: true,
  })
}

async function removeDirectory(directoryPath: string): Promise<void> {
  await rm(directoryPath, { force: true, recursive: true })
}
export { copyDirectory, removeDirectory }
