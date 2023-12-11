import { derived } from 'svelte/store'

import { list } from '@/stores'
import type { PageLoad } from './$types'

export const load: PageLoad = async function ({ parent, url }) {
  const { properties } = await parent()

  return {
    properties: list(
      derived(properties, ps => ps.all),
      {
        weights: { name: 0.7, aliases: 0.7, description: 0.3 },
      },
    ),
  }
}
