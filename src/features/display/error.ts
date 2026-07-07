import { log } from "@clack/prompts"

import { truncateTextByDisplayWidth } from "@/tools/string"

const ERROR_MESSAGE_MAX_DISPLAY_WIDTH = 80

function renderErrorDisplay(title: string, message: string): void {
  const truncatedMessage = truncateTextByDisplayWidth(message, ERROR_MESSAGE_MAX_DISPLAY_WIDTH)
  log.error(`${title} (${truncatedMessage})`)
}

export { renderErrorDisplay }
