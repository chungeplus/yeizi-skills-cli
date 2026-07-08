/**
 * 远端技能仓库的定位配置。
 */
interface RemoteRepositoryConfig {
  /**
   * 远端仓库所有者。
   */
  remoteRepositoryOwner: string

  /**
   * 远端仓库名称。
   */
  remoteRepositoryName: string

  /**
   * 远端仓库分支。
   */
  remoteRepositoryBranch: string

  /**
   * 远端仓库技能目录名称。
   */
  remoteRepositorySkillDirectoryName: string
}

export type { RemoteRepositoryConfig }
