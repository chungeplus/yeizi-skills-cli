import boxen from "boxen"

import chalk from "chalk"

function renderErrorDisplay(title: string, message: string): void {
  console.error(boxen(
    chalk.yellow(message),
    {
      title: chalk.bold.red(title),
      titleAlignment: "center",
      padding: { top: 1, bottom: 1, left: 3, right: 3 },
      margin: 1,
      borderStyle: "round",
      borderColor: "red",
      textAlignment: "center",
    },
  ))
}

export { renderErrorDisplay }
