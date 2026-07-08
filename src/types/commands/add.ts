/**
 * `add` 命令的原始选项。
 */
interface RawAddCommandOption {
  /**
   * `--skill <name>` 选项值。
   */
  skill?: string
}

/**
 * `add` 命令的归一化选项。
 */
interface AddCommandOption {
  /**
   * 技能名原始文本。
   */
  rawSkillNameText: string | undefined
}

export type { AddCommandOption, RawAddCommandOption }
