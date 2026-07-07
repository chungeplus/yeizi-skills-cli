import process from "node:process"

async function runBuild(): Promise<void> {
  await Bun.$`rm -rf dist`

  const buildResult = await Bun.build({
    entrypoints: ["./src/bin/cli.ts"],
    outdir: "./dist",
    naming: "index.[ext]",
    target: "bun",
    format: "esm",
  })

  if (!buildResult.success) {
    console.error("构建失败：")
    for (const log of buildResult.logs) {
      console.error(log)
    }
    process.exit(1)
  }
}

runBuild().catch((error) => {
  console.error(error)
  process.exit(1)
})
