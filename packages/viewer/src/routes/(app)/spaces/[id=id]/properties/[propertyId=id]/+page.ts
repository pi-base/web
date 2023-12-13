import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { normalizeIdRedirect } from '@/util'

export const load: PageLoad = async function ({
  params: { id: spaceId, propertyId },
  parent,
  url,
}) {
  normalizeIdRedirect(url, spaceId, propertyId)

  const { load, spaces, properties, theorems, traits, checked } = await parent()

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
    throw error(404, `Trait not found ${spaceId} / ${propertyId}`)
  })
}
