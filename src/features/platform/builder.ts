import type { PlatformItem, PlatformName } from "@/types/platform"

import { LocalPlatformService } from "@/features/platform"

async function buildPlatformList(platformNameList: PlatformName[]): Promise<PlatformItem[]> {
  const localPlatformList = await LocalPlatformService.getLocalPlatformList()

  const platformList = platformNameList.map(
    platformName => localPlatformList.find(localPlatformItem => localPlatformItem.platformName === platformName)!,
  )

  return platformList
}

export { buildPlatformList }
