import { parser } from '@pi-base/core'

const link = true // FIXME
const full = parser({ link, truncate: false })
const truncated = parser({ link, truncate: true })

function translate(str: string) {
  /**
   * HACK: we want to be flexible in the math delimiters that we accept, but the
   * remark-math plugin only supports $-variants, and stictly expects newline
   * spacing around $$-style display math.
   *
   * The "right" fix here is likely to extend the tokenizer to support these
   * other delimeter styles, but the more expedient solution is to do a
   * pre-processing step to convert them to the supported style.
   *
   * Note that `replace` accepts $1-style replacement directives, so to emit a
   * single $, we need to use $$.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
   */
  return (
    str
      // Turn \( and \) into $
      .replace(/\\[()]/g, '$$')
      // Turn \[ and \] into $$
      .replace(/\\[\[\]]/g, '$$$$')
      // Normalize the spacing around $$s
      .replace(/\s*\$\$\s*/g, '\n$$$$\n')
  )
}

export async function render(body: string, truncate: boolean = false) {
  const parser = truncate ? truncated : full

  const file = await parser.process(translate(body))

  return String(file)
}
