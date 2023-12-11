import { derived } from 'svelte/store'

import { list } from '@/stores'
import type { PageLoad } from './$types'

export const load: PageLoad = async function ({ parent, url }) {
  const { theorems } = await parent()

  return {
    theorems: list(
      derived(theorems, ts => ts.all),
      {
        weights: { name: 0.7, description: 0.3 },
      },
    ),
  }
}
