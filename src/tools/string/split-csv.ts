function splitCsvString(csvString: string): string[] {
  return Array.from(new Set(
    csvString
      .split(",")
      .map(optionItem => optionItem.trim())
      .filter(optionItem => optionItem.length > 0),
  ))
}

export { splitCsvString }
