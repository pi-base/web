import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'

import type { PageLoad } from './$types'

export const load: PageLoad = async function ({
  params: { id: spaceId, propertyId },
  parent,
}) {
  const { load, spaces, properties, theorems, traits, checked } = await parent()

  await checked(spaceId)

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
  ).catch(() => {
    error(404, `Trait not found ${spaceId} / ${propertyId}`)
  })
}
