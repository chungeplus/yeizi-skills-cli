interface RawInstallCommandOption {
  skill?: string
}

interface InstallCommandOption {
  rawSkillNameText: string | undefined
}

export type { InstallCommandOption, RawInstallCommandOption }
