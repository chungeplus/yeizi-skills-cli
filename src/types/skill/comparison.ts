import type { SkillName } from "./common"
import type { PlatformName } from "@/types/platform"
import { SkillComparisonState } from "@/constants/skill"

type SkillComparisonStateType = (typeof SkillComparisonState)[keyof typeof SkillComparisonState]

interface SkillComparisonRow {

  platformName: PlatformName

  skillName: SkillName

  skillComparisonState: SkillComparisonStateType
}

export type { SkillComparisonRow, SkillComparisonStateType }
