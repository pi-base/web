import { error } from '@sveltejs/kit'

import type { Space } from '../../../../models'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async function ({ params, parent }) {
  const { spaces } = await parent()

  const space: Space = await new Promise((resolve, reject) => {
    spaces.subscribe($spaces => {
      const space = $spaces.find(params.id)
      if (space) {
        resolve(space)
      } else {
        reject(error(404, `Property not found ${params.id}`))
      }
    })
  })

  return { space }
}
