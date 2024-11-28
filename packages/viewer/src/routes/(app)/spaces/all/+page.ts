import { derived } from 'svelte/store'

import { list } from '@/stores'
import type { PageLoad } from './$types'

import { searchWeights } from '@/constants'

export const load: PageLoad = async function ({ parent, url }) {
  const { spaces } = await parent()

  return {
    spaces: list(
      derived(spaces, ss => ss.all),
      {
        weights: searchWeights,
      },
    ),
  }
}
