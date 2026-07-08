/**
 * 单个技能条目的描述信息。
 */
interface SkillItem {
  /**
   * 技能名。
   */
  skillName: string

  /**
   * 技能简介。
   */
  skillDescription: string
}

/**
 * 技能条目的有序集合。
 */
type SkillList = SkillItem[]

export type { SkillItem, SkillList }
