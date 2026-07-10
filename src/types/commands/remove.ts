/**
 * `remove` 命令的原始选项。
 */
interface RawRemoveCommandOption {
  /**
   * `--skill <name>` 选项值。
   */
  skill?: string
}

/**
 * `remove` 命令的归一化选项。
 */
interface RemoveCommandOption {
  /**
   * 技能名原始文本。
   */
  rawSkillNameText: string | undefined
}

export type { RawRemoveCommandOption, RemoveCommandOption }
