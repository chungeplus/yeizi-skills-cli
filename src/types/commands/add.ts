interface RawAddCommandOption {
  skill?: string
}

interface AddCommandOption {
  rawSkillNameText: string | undefined
}

export type { AddCommandOption, RawAddCommandOption }
