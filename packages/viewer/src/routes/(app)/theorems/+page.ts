import { derived } from 'svelte/store'

import { list } from '@/stores'
import type { PageLoad } from './$types'

import { searchWeights } from '@/constants'

export const load: PageLoad = async function ({ parent, url }) {
  const { theorems } = await parent()

  return {
    theorems: list(
      derived(theorems, ts => ts.all),
      {
        weights: searchWeights,
      },
    ),
  }
}
