import * as z from 'zod'
import * as yaml from 'js-yaml'

// TODO: unify with logic in packages/compiler
export function parseDocument<T>(schema: z.ZodSchema<T>, contents: string) {
  const match = contents.match(
    /^(---)?\s*(?<frontmatter>[\s\S]*?)\s*---(?<body>[\s\S]*)/,
  )
  if (!match?.groups) {
    return
  }

  const { frontmatter, body } = match.groups
  const meta = yaml.load(frontmatter)
  const data = { description: body.trim() }
  const raw = typeof meta === 'object' ? { ...meta, ...data } : data

  return schema.safeParse(raw)
}
