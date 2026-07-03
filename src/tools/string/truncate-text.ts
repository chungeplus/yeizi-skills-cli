function truncateText(text: string, truncateLimit: number): string {
  if (text.length <= truncateLimit) {
    return text
  }

  return `${text.slice(0, truncateLimit)}…`
}

export { truncateText }
