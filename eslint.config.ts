import antfu from "@antfu/eslint-config"

export default antfu(
  {
    type: "lib",
    stylistic: {
      quotes: "double",
    },
    typescript: {
      tsconfigPath: "tsconfig.json",
    },
    rules: {

    },
    ignores: [
      "AGENTS.md",
      "CLAUDE.md",
      "docs/**",
      "dist/**",
    ],
  },
)
