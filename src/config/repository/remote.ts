import type { RemoteRepositoryConfig } from "@/types/repository"

const remoteRepositoryConfig: RemoteRepositoryConfig = {

  remoteRepositoryOwner: "chungeplus",

  remoteRepositoryName: "yeizi-skills",

  remoteRepositoryBranch: "main",

  remoteRepositorySkillDirectoryName: "skill",
} as const

export { remoteRepositoryConfig }
