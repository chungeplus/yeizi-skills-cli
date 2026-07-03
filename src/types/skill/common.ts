type SkillName = string

type SkillDescription = string

interface SkillItem {
  skillName: SkillName

  skillDescription: SkillDescription
}

type SkillList = SkillItem[]

export type { SkillDescription, SkillItem, SkillList, SkillName }
