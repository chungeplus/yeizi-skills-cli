/**
 * 解析逗号分隔字符串。
 *
 * @param csvString - 逗号分隔字符串
 * @returns 字符串数组
 *
 * @example
 * ```typescript
 * const nameList = splitCsvString(" a ,b ,, a ") // ["a", "b"]
 * const dedupedNameList = splitCsvString("web,api , web") // ["web", "api"]
 * ```
 */
function splitCsvString(csvString: string): string[] {
  return Array.from(new Set(
    csvString
      .split(",")
      .map(csvSegment => csvSegment.trim())
      .filter(csvSegment => csvSegment.length > 0),
  ))
}

export { splitCsvString }
