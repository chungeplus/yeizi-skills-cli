import type { SummaryDisplayOption } from "@/types/display"

import boxen from "boxen"

import chalk from "chalk"

function renderSummaryDisplay(summaryDisplayOption: SummaryDisplayOption): void {
  console.log(boxen(
    chalk.yellow(summaryDisplayOption.messageList.join("\n")),
    {
      title: chalk.bold.green(summaryDisplayOption.title),
      titleAlignment: "center",
      padding: { top: 1, bottom: 1, left: 5, right: 5 },
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
      textAlignment: "center",
    },
  ))
}

export { renderSummaryDisplay }
