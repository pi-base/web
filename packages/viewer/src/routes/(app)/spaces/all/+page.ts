import { derived } from 'svelte/store'

import { list } from '@/stores'
import type { PageLoad } from './$types'

export const load: PageLoad = async function ({ parent, url }) {
  const { spaces } = await parent()

  return {
    spaces: list(
      derived(spaces, ss => ss.all),
      {
        weights: { name: 0.7, aliases: 0.7, description: 0.3 },
      },
    ),
  }
}
