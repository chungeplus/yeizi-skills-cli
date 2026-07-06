import { log, note } from "@clack/prompts"
import stringWidth from "string-width"

function buildTableColumnMaxWidthList(tableColumnCount: number, tableRowList: string[][]): number[] {
  const tableColumnMaxWidthList: number[] = Array
    .from({ length: tableColumnCount }, (_tableColumnValue, tableColumnIndex) => tableColumnIndex)
    .fill(0)

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
    tableColumnMaxWidth => tableColumnMaxWidth + COLUMN_GAP_WIDTH,
  )
  const formattedRowList = tableRowList.map(tableColumnList =>
    formatTableColumnList(tableColumnList, columnTotalWidthList).trimEnd(),
  )

  note(formattedRowList.join("\n"), tableTitle, { withGuide: false })
}

export { renderTableDisplay }
