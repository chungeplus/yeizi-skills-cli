import stringWidth from "string-width"

/**
 * 按显示宽度截断文本，超长时附加省略号。
 *
 * @param sourceText - 原始文本
 * @param maxDisplayWidth - 最大显示宽度
 * @returns 文本
 *
 * @example
 * ```typescript
 * const truncatedText = truncateTextByDisplayWidth("Hello World", 8) // "Hello..."
 * const summaryText = truncateTextByDisplayWidth("Hello", 8) // "Hello"
 * ```
 */
function truncateTextByDisplayWidth(sourceText: string, maxDisplayWidth: number): string {
  const ellipsisText = "..."
  const ellipsisDisplayWidth = stringWidth(ellipsisText)
  const sourceTextMaxDisplayWidth = maxDisplayWidth - ellipsisDisplayWidth
  const sourceTextCodePointList = Array.from(sourceText)
  let currentDisplayWidth = 0
  const truncatedCodePointIndex = sourceTextCodePointList.findIndex((codePoint) => {
    currentDisplayWidth += stringWidth(codePoint)
    return currentDisplayWidth > sourceTextMaxDisplayWidth
  })
  if (truncatedCodePointIndex === -1) {
    return sourceText
  }
  return sourceTextCodePointList.slice(0, truncatedCodePointIndex).join("") + ellipsisText
}

export { truncateTextByDisplayWidth }
