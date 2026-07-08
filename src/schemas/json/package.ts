import { z } from "zod"

/**
 * 校验 `package.json` 中项目必需的固定配置。
 *
 * @example
 * ```typescript
 * const packageJson = packageJsonSchema.parse({ bin: { "yeizi-skills": "dist/index.js" }, description: "yeizi-skills CLI", version: "0.1.1" }) // { bin: { "yeizi-skills": "dist/index.js" }, description: "yeizi-skills CLI", version: "0.1.1" }
 * ```
 */
const packageJsonSchema = z.object({
  /**
   * 可执行入口映射。
   */
  bin: z.record(z.string()),

  /**
   * 命令行工具的简短描述。
   */
  description: z.string().trim().min(1, "package.json 中缺少 description 配置。"),

  /**
   * 当前项目版本字符串。
   */
  version: z.string().trim().min(1, "package.json 中缺少 version 配置。"),
}).passthrough()

export { packageJsonSchema }
