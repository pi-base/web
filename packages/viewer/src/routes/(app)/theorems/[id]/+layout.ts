import { error } from '@sveltejs/kit'

import type { Theorem } from '../../../../models'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async function ({ params, parent }) {
  const { theorems } = await parent()

  const theorem: Theorem = await new Promise((resolve, reject) => {
    theorems.subscribe($theorems => {
      const theorem = $theorems.find(params.id)
      if (theorem) {
        resolve(theorem)
      } else {
        reject(error(404, `Theorem not found ${params.id}`))
      }
    })
  })

  return { theorem }
}
