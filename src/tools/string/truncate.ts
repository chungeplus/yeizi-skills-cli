import stringWidth from "string-width"

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
