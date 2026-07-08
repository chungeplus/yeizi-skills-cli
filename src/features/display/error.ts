import { log } from "@clack/prompts"

import { truncateTextByDisplayWidth } from "@/tools/string"

/**
 * 错误消息的最大显示宽度。
 */
const ERROR_MESSAGE_MAX_DISPLAY_WIDTH = 80

/**
 * 错误显示助手。打印单行错误，超长 message 按显示宽度截断。
 *
 * @param title - 错误标题
 * @param message - 错误详情
 *
 * @example
 * ```typescript
 * renderErrorDisplay("错误", "网络连接失败，请稍后重试。")
 * ```
 */
function renderErrorDisplay(title: string, message: string): void {
  const truncatedMessage = truncateTextByDisplayWidth(message, ERROR_MESSAGE_MAX_DISPLAY_WIDTH)
  log.error(`${title} (${truncatedMessage})`)
}

export { renderErrorDisplay }
