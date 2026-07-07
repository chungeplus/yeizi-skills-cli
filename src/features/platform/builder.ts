import type { PlatformItem } from "@/types/platform"

import { LocalPlatformService } from "./local"

async function buildPlatformList(platformNameList: string[]): Promise<PlatformItem[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const platformList = platformNameList.map(
    platformName => localPlatformList.find(localPlatformItem => localPlatformItem.platformName === platformName)!,
  )

  return platformList
}

export { buildPlatformList }
