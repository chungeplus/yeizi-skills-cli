import type { LocalPlatformConfig } from "@/types/platform"
import { homedir } from "node:os"
import { join } from "node:path"

/**
 * 当前用户主目录绝对路径。
 */
const userHomeDirectoryPath = homedir()

/**
 * 本地平台配置。
 */
const localPlatformConfig: LocalPlatformConfig = {
  localPlatformList: [
    {
      localPlatformName: "Codex",
      localPlatformHomeDirectoryPath: join(userHomeDirectoryPath, ".codex"),
      localPlatformSkillDirectoryPath: join(userHomeDirectoryPath, ".codex", "skills"),
    },
    {
      localPlatformName: "Claude Code",
      localPlatformHomeDirectoryPath: join(userHomeDirectoryPath, ".claude"),
      localPlatformSkillDirectoryPath: join(userHomeDirectoryPath, ".claude", "skills"),
    },
    {
      localPlatformName: "Trae",
      localPlatformHomeDirectoryPath: join(userHomeDirectoryPath, ".trae"),
      localPlatformSkillDirectoryPath: join(userHomeDirectoryPath, ".trae", "skills"),
    },
  ],
}

export { localPlatformConfig }
