import type { Space } from '@/models'
import { normalizeIdRedirect } from '@/util'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async function ({ params, parent, url }) {
  normalizeIdRedirect(url, params.id)

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
