interface PackageJson {

  bin: Record<string, string>

  description: string

  version: string
}

export type { PackageJson }
