import { parser } from '@pi-base/core'
// TODO
// import { truncate } from './Display'

const full = parser(false)
// const truncated = parser().use([truncate])

export async function render(body: string, truncate: boolean = false) {
  // const parser = truncate ? truncated : full
  const parser = full

  const file = await parser.process(body)

  return String(file)
}
