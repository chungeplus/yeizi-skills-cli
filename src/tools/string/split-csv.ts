function splitCsvString(csvString: string): string[] {
  return Array.from(new Set(
    csvString
      .split(",")
      .map(csvSegment => csvSegment.trim())
      .filter(csvSegment => csvSegment.length > 0),
  ))
}

export { splitCsvString }
