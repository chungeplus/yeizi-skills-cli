import boxen from "boxen"

import chalk from "chalk"

function renderTableDisplay(
  title: string,
  headerTextList: string[],
  tableContentDataList: string[][],
): void {
  const dividerTextList = headerTextList.map(() => "---")
  const lineTextList = [headerTextList, dividerTextList, ...tableContentDataList]
  const tableText = lineTextList.map(lineCellTextList => lineCellTextList.join(" | ")).join("\n")

  console.log(boxen(
    chalk.yellow(tableText),
    {
      title: chalk.bold.green(title),
      titleAlignment: "center",
      padding: { top: 1, bottom: 1, left: 5, right: 5 },
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
      textAlignment: "left",
    },
  ))
}

export { renderTableDisplay }
