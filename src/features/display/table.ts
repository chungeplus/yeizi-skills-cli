import { log, note } from "@clack/prompts"
import stringWidth from "string-width"

/**
 * 计算表格每一列按显示宽度的最大列宽。
 *
 * @param tableColumnCount - 表格列数
 * @param tableRowList - 表格行列表，每行为一列字符串数组
 * @returns 列宽列表
 *
 * @example
 * ```typescript
 * const columnMaxWidthList = buildTableColumnMaxWidthList(2, [["web", "codex"], ["api", "claude"]]) // [3, 6]
 * ```
 */
function buildTableColumnMaxWidthList(tableColumnCount: number, tableRowList: string[][]): number[] {
  const tableColumnMaxWidthList: number[] = Array.from<number>({ length: tableColumnCount }).fill(0)

  tableRowList.forEach((tableColumnList) => {
    tableColumnList.forEach((tableColumnItem, tableColumnIndex) => {
      const tableColumnDisplayWidth = stringWidth(tableColumnItem)
      if (tableColumnDisplayWidth > tableColumnMaxWidthList[tableColumnIndex]) {
        tableColumnMaxWidthList[tableColumnIndex] = tableColumnDisplayWidth
      }
    })
  })

  return tableColumnMaxWidthList
}

/**
 * 生成等宽对齐的表格行。
 *
 * @param tableColumnList - 当前行的单元格
 * @param tableColumnTotalWidthList - 每列总宽度
 * @returns 单行文本
 *
 * @example
 * ```typescript
 * const paddedColumnText = formatTableColumnList(["a", "bc"], [3, 4]) // "a  bc  "
 * ```
 */
function formatTableColumnList(tableColumnList: string[], tableColumnTotalWidthList: number[]): string {
  return tableColumnList
    .map((tableColumnItem, tableColumnIndex) => {
      const currentDisplayWidth = stringWidth(tableColumnItem)
      if (currentDisplayWidth >= tableColumnTotalWidthList[tableColumnIndex]) {
        return tableColumnItem
      }
      return tableColumnItem + " ".repeat(tableColumnTotalWidthList[tableColumnIndex] - currentDisplayWidth)
    })
    .join("")
}

/**
 * 在终端中展示等宽对齐的表格。
 *
 * @param tableTitle - 表格展示标题
 * @param tableRowList - 表格行列表，每行为一列字符串数组
 *
 * @example
 * ```typescript
 * renderTableDisplay("技能列表", [["web", "codex"], ["api", "claude"]])
 * ```
 */
function renderTableDisplay(tableTitle: string, tableRowList: string[][]): void {
  const COLUMN_GAP_WIDTH = 8

  log.message("")

  if (tableRowList.length === 0) {
    note("暂无数据", tableTitle, { withGuide: false })
    return
  }

  const tableColumnCount = tableRowList[0].length
  const tableColumnMaxWidthList = buildTableColumnMaxWidthList(tableColumnCount, tableRowList)
  const columnTotalWidthList = tableColumnMaxWidthList.map(
    (tableColumnMaxWidth, tableColumnIndex) => {
      if (tableColumnIndex === tableColumnCount - 1) {
        return tableColumnMaxWidth
      }
      return tableColumnMaxWidth + COLUMN_GAP_WIDTH
    },
  )
  const formattedRowList = tableRowList.map(tableColumnList =>
    formatTableColumnList(tableColumnList, columnTotalWidthList),
  )

  note(formattedRowList.join("\n"), tableTitle, { withGuide: false })
}

export { renderTableDisplay }
