import { cp, rm } from "node:fs/promises"

async function copyDirectory(sourceDirectoryPath: string, targetDirectoryPath: string): Promise<void> {
  await cp(sourceDirectoryPath, targetDirectoryPath, {
    recursive: true,
    force: true,
  })
}

async function removeDirectory(directoryPath: string): Promise<void> {
  await rm(directoryPath, { force: true, recursive: true })
}

export { copyDirectory, removeDirectory }
