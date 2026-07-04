import type { LocalPlatformConfig } from "@/types/platform"
import { homedir } from "node:os"
import { join } from "node:path"

const userHomeDirectoryPath = homedir()

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

} as const

export { localPlatformConfig }
