import { log } from "@clack/prompts"

function renderErrorDisplay(title: string, message: string): void {
  log.error(`${title} (${message})`)
}

export { renderErrorDisplay }
