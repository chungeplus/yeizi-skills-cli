/**
 * 当前项目 `package.json` 字段。
 */
interface PackageJson {
  /**
   * 可执行入口映射。
   */
  bin: Record<string, string>

  /**
   * 命令行工具的简短描述。
   */
  description: string

  /**
   * 当前项目版本字符串。
   */
  version: string
}

export type { PackageJson }
