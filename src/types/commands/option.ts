/**
 * 命令注册时使用的选项元数据。
 */
interface CommandOption {
  /**
   * 命令行标记，例如 `-s, --skill <name>`。
   */
  commandOptionFlag: string

  /**
   * 选项在 `--help` 中展示的说明文本。
   */
  commandOptionDescription: string
}

export type { CommandOption }
