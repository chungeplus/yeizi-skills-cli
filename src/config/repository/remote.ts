import type { RemoteRepositoryConfig } from "@/types/repository"

/**
 * 远端技能仓库配置，用于拼接下载地址。
 */
const remoteRepositoryConfig: RemoteRepositoryConfig = {
  /**
   * 远端仓库服务基础地址。
   */
  remoteRepositoryBaseUrl: "http://git.mingto.net",
  /**
   * 远端仓库所有者（命名空间）。
   */
  remoteRepositoryOwner: "hcc",
  /**
   * 远端仓库名称。
   */
  remoteRepositoryName: "mt-utils",
  /**
   * 远端仓库分支。
   */
  remoteRepositoryBranch: "main",
  /**
   * 远端仓库技能目录名称。
   */
  remoteRepositorySkillDirectoryName: "skills",
}

export { remoteRepositoryConfig }
