import type { PageLoad } from './$types'
import { get } from 'svelte/store'

export const load: PageLoad = async ({
  params: { id: spaceId, propertyId },
  parent,
}) => {
  const { spaces, properties, theorems, traits, load, checked } = await parent()

  return load(
    traits,
    ts =>
      ts.lookup({
        spaceId,
        propertyId,
        spaces: get(spaces),
        properties: get(properties),
        theorems: get(theorems),
      }),
    checked(spaceId),
  )
}
