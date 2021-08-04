import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import { unified, Processor, Transformer } from 'unified'
import unist from 'unist'
import { visit } from 'unist-util-visit'
import {
  Code,
  CompileContext,
  Effects,
  Extension,
  HtmlExtension,
  Token,
  State,
} from 'micromark-util-types'
import { toH } from 'hast-to-hyperscript'
import h from 'hyperscript'

const dollarSign = 36
const leftBrace = 123
const rightBrace = 125

// TODO: should we support \(...\) and \[...\] style math? Or standardize on $?
const syntax: Extension = {
  text: {
    [leftBrace]: {
      // See https://github.com/micromark/micromark#extending-markdown
      //
      // Aims to parse
      //    {value}  => { type: 'internalLink', value }
      //   {{value}} => { type: 'citation', value }
      tokenize(effects: Effects, ok: State, nok: State) {
        let external = false

        // HACK
        // For some reason, fromMarkdown's this.buffer() / this.resume() does
        // not appear to actually buffer and return the contents we're consuming.
        //
        // For now we'll manually track them while scanning, and emit a
        // synthetic event with the full context _after_ the scan.
        const buffer: number[] = []

        function start(code: Code) {
          if (code !== leftBrace) {
            return nok(code) // Expected {
          }

          effects.enter('citation')
          effects.enter('citationMarker')
          effects.consume(code)
          return nesting
        }

        function nesting(code: Code) {
          if (code === leftBrace) {
            if (external) {
              return nok(code) // Unexpected {{{
            }

            external = true
            effects.consume(code)

            effects.exit('citationMarker')
            // HACK: we're manually buffering, so can't emit this event yet
            // effects.enter('citationString', { type: 'citation' })
            return body
          } else {
            effects.exit('citationMarker')
            // HACK: we're manually buffering, so can't emit this event yet
            // effects.enter('citationString', { type: 'internalLink' })
            return body(code)
          }
        }

        function body(code: Code) {
          if (code === null) {
            return nok(code) // Unexpected EOF
          }

          if (code === rightBrace) {
            // HACK: per above, we can now manually emit the buffered content
            const value = String.fromCharCode(...buffer)
            effects.enter('citationString', {
              external,
              value,
            })
            effects.exit('citationString')
            effects.enter('citationMarker')
            return close(code)
          }

          buffer.push(code)
          effects.consume(code)
          return body
        }

        function close(code: Code) {
          if (code !== rightBrace) {
            return nok(code)
          }

          if (external) {
            external = false
            effects.consume(code)
            return close
          }

          effects.consume(code)
          effects.exit('citationMarker')
          effects.exit('citation')
          return ok
        }

        return start
      },
    },
    [dollarSign]: {
      tokenize: tokenizeMath,
    },
  },
}

function tokenizeMath(effects: Effects, ok: State, nok: State) {
  let display = false
  const buffer: number[] = []

  function start(code: Code) {
    if (code !== dollarSign) {
      return nok(code)
    }

    effects.enter('math')
    effects.enter('mathMarker')
    effects.consume(code)
    return nesting
  }

  function nesting(code: Code) {
    if (code === dollarSign) {
      if (display) {
        return nok(code) // Unexpected $$$
      }

      display = true
      effects.consume(code)
    }

    effects.exit('mathMarker')
    return body
  }

  function body(code: Code) {
    if (code === null) {
      return nok(code) // Unexpected EOF
    }

    if (code === dollarSign) {
      const value = String.fromCharCode(...buffer)
      effects.enter('mathString', {
        display,
        value,
      })
      effects.exit('mathString')
      effects.enter('mathMarker')
      return close(code)
    }

    buffer.push(code)
    effects.consume(code)
    return body
  }

  function close(code: Code) {
    if (code !== dollarSign) {
      return nok(code)
    }

    if (display) {
      display = false
      effects.consume(code)
      return close
    }

    effects.consume(code)
    effects.exit('citationMarker')
    effects.exit('citation')
    return ok
  }

  return start
}

const fromMarkdown: HtmlExtension = {
  enter: {
    citationString(this: CompileContext, token: Token) {
      // HACK: a few things about the types don't seem to actually track with
      // the runtime behavior
      //
      // - buffer / resume does not appear to work, per the above (although this
      //   may be a configuration issue)
      // - we don't _want_ to use this.raw, as we're not emitting a raw string;
      //   rather, we want to pass { type, value } tokens on for downstream
      //   consumers
      // - token will have the extra fields specified during the `enter` that
      //   emitted them
      //
      /* eslint-disable */
      // @ts-ignore
      const { external, value } = token
      // @ts-ignore
      this.enter({ type: external ? 'citation' : 'internalLink', value }, token)
      /* eslint-disable */
      this.buffer()
    },
    mathString(this: CompileContext, token: Token) {
      /* eslint-disable */
      // @ts-ignore
      const { display, value } = token
      // @ts-ignore
      this.enter({ type: display ? 'blockMath' : 'inlineMath', value }, token)
      /* eslint-disable */
      this.buffer()
    },
  },
  exit: {
    citationString(this: CompileContext, token: Token) {
      this.resume()
      // @ts-ignore
      this.exit(token)
    },
    mathString(this: CompileContext, token: Token) {
      this.resume()
      // @ts-ignore
      this.exit(token)
    },
  },
}

export function tokenize(this: Processor): void {
  const data = this.data()

  add('micromarkExtensions', syntax)
  add('fromMarkdownExtensions', fromMarkdown)

  function add(field: string, value: unknown) {
    const found = data[field]

    if (found && found instanceof Array) {
      found.push(value)
    } else {
      data[field] = [value]
    }
  }
}

export function transformTokens(this: Processor): Transformer {
  return function transformer(tree: unist.Node) {
    visit<unist.Node & { value?: unknown }, string>(
      tree,
      'citation',
      (node) => {
        node.data = {
          hName: 'citation',
          hChildren: [{ type: 'text', value: node.value }],
        }
      },
    )

    visit<unist.Node & { value?: unknown }, string>(
      tree,
      'internalLink',
      (node) => {
        node.data = {
          hName: 'internalLink',
          hChildren: [{ type: 'text', value: node.value }],
        }
      },
    )

    visit<unist.Node & { value?: unknown }, string>(
      tree,
      'blockMath',
      (node) => {
        node.data = {
          hName: 'span',
          hProperties: {
            className: ['math-display'],
          },
          hChildren: [{ type: 'text', value: node.value }],
        }
      },
    )

    visit<unist.Node & { value?: unknown }, string>(
      tree,
      'inlineMath',
      (node) => {
        node.data = {
          hName: 'span',
          hProperties: {
            className: ['math-inline'],
          },
          hChildren: [{ type: 'text', value: node.value }],
        }
      },
    )
  }
}

export async function renderHTML(processor: Processor, body: string) {
  const parsed = await processor.run(processor.parse(body))
  // @ts-ignore
  return toH(h, parsed).innerHTML
}

export function tokenized(): Processor {
  return unified().use(remarkParse).use(tokenize)
}

export function html(): Processor {
  return (
    tokenized()
      .use(transformTokens)
      // @ts-ignore
      .use(remarkRehype)
      // @ts-ignore
      .use(rehypeKatex)
  )
}
