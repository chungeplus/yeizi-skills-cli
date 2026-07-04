import boxen from "boxen"

import chalk from "chalk"
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

function renderTableDisplay(
  tableTitle: string,
  tableRowList: string[][],
): void {
  const COLUMN_GAP_WIDTH = 8
  let tableText = ""

  if (tableRowList.length > 0) {
    const tableColumnCount = tableRowList[0].length
    const tableColumnMaxWidthList = buildTableColumnMaxWidthList(tableColumnCount, tableRowList)
    const tableColumnTotalWidthList = tableColumnMaxWidthList.map(
      tableColumnMaxWidth => tableColumnMaxWidth + COLUMN_GAP_WIDTH,
    )
    tableText = tableRowList
      .map(tableColumnList => formatTableColumnList(tableColumnList, tableColumnTotalWidthList))
      .join("\n")
  }

  console.log(boxen(
    chalk.yellow(tableText),
    {
      title: chalk.bold.green(tableTitle),
      titleAlignment: "center",
      padding: { top: 1, bottom: 1, left: 3, right: 3 },
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
      textAlignment: "left",
    },
  ))
}

export { renderTableDisplay }
