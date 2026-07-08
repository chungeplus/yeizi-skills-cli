import type { RawSkillEntryFileObject } from "@/types/skill"
import { z } from "zod"

/**
 * 校验远程技能仓库 `SKILL.md` frontmatter 解析后的对象。
 *
 * @example
 * ```typescript
 * skillEntryFileObjectSchema.parse({
 *   name: "web",
 *   description: "前端技能集合",
 * })
 * ```
 */
const skillEntryFileObjectSchema: z.ZodSchema<RawSkillEntryFileObject> = z
  .object({
    /**
     * 技能名。
     */
    name: z.string(),

    /**
     * 技能简介。
     */
    description: z.string(),
  })
  .passthrough()

export { skillEntryFileObjectSchema }
