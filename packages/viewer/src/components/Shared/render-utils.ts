import { parser } from '@pi-base/core'

const link = true // FIXME
const full = parser({ link, truncate: false })
const truncated = parser({ link, truncate: true })

export async function render(body: string, truncate: boolean = false) {
  const parser = truncate ? truncated : full

  console.log('Rendering', body)
  const file = await parser.process(body)

  return String(file)
}
