import type { Property } from '@/models'
import { normalizeIdRedirect } from '@/util'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async function ({ params, parent, url }) {
  normalizeIdRedirect(url, params.id)

  const { properties } = await parent()

  const property: Property = await new Promise((resolve, reject) => {
    properties.subscribe($properties => {
      const property = $properties.find(params.id)
      if (property) {
        resolve(property)
      } else {
        reject(error(404, `Property not found ${params.id}`))
      }
    })
  })

  return { property }
}
