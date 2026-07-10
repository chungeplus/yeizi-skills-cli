/**
 * 技能在各平台的添加状态。
 */
interface SkillPlatformItem {
  /**
   * 技能名。
   */
  skillName: string

  /**
   * 已添加该技能的平台名列表。
   */
  addedPlatformNameList: string[]
}

export type { SkillPlatformItem }
