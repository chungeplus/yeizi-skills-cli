import type { SkillDescription, SkillName } from "./common"

interface RawSkillEntryFileObject {
  name: SkillName

  description: SkillDescription
}

export type { RawSkillEntryFileObject }
