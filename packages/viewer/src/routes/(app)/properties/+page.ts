import { derived } from 'svelte/store'

import { list } from '@/stores'
import type { PageLoad } from './$types'

import { searchWeights } from '@/constants'

export const load: PageLoad = async function ({ parent, url }) {
  const { properties } = await parent()

  return {
    properties: list(
      derived(properties, ps => ps.all),
      {
        weights: searchWeights,
      },
    ),
  }
}
