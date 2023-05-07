import type {
  CompileContext,
  Extension as FromMarkdownExtension,
} from 'mdast-util-from-markdown'
import type { Code, Construct, Token, Tokenizer } from 'micromark-util-types'
import type { Plugin, Processor } from 'unified'

/**
 * Extends the Markdown parser, adding support for
 *
 * external links
 *
 *    input: {{doi:123}}
 *    output:
 *
 *    {
 *      type: 'externalLink',
 *      data: {
 *        hName: 'external-link',
 *        hProperties: {
 *          kind: 'doi',
 *          id: '123'
 *        }
 *      }
 *    }
 *
 * internal links
 *
 *    input: {S123}
 *    output:
 *
 *    {
 *      type: 'internalLink',
 *      data: {
 *        hName: 'internal-link',
 *        hProperties: {
 *          kind: 'space',
 *          id: '123'
 *        }
 *      }
 *    }
 *
 *
 * See https://github.com/micromark/micromark#creating-a-micromark-extension
 */
const cr = -5
const lf = -4
const crlf = -3
const eof = null
const colon = 58
const leftBrace = 123
const rightBrace = 125

function prefixKind(code: Code) {
  switch (code) {
    case 80: // P
    case 112: // p
      return 'property'
    case 83: // S
    case 115: // s
      return 'space'
    case 84: // T
    case 116: // t
      return 'theorem'
    default:
      return null
  }
}

const tokenize: Tokenizer = (effects, ok, nok) => {
  /* The tokenizer is a state machine that starts in the `start` state,
   * accumulating text and transitioning as described above the other states
   * below.
   */
  return start

  /* Consumes the single starting { */
  function start(code: Code) {
    effects.consume(code)

    return internalOrExternal
  }

  /* Consumes a single character
   * - if {, parse the rest as an external link
   * - otherwise parse an interal link with kind determined by the consumed
   *   character [PST]
   */
  function internalOrExternal(code: Code) {
    if (code === leftBrace) {
      effects.consume(code)

      effects.enter('externalLink')
      effects.enter('externalKind')
      effects.enter('chunkString', { contentType: 'string' })
      return externalKind
    }

    effects.consume(code)
    const kind = prefixKind(code)
    if (kind) {
      effects.enter('internalLink', { kind })
      effects.enter('chunkString', { contentType: 'string' })
      return internalId
    }

    return nok(code)
  }

  /* Consume word characters up to a :, then transition to externalId */
  function externalKind(code: Code) {
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === colon) {
      effects.exit('chunkString')
      effects.exit('externalKind')
      effects.consume(code)
      effects.enter('externalId')
      effects.enter('chunkString', { contentType: 'string' })
      return externalId
    }

    effects.consume(code)
    return externalKind
  }

  /* Consume word characters up to a }, then finalize */
  function internalId(code: Code) {
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === rightBrace) {
      effects.exit('chunkString')
      effects.exit('internalLink')
      return close(code)
    }

    effects.consume(code)
    return internalId
  }

  /* Consume word characters up to a }, then finalize */
  function externalId(code: Code) {
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === rightBrace) {
      effects.exit('chunkString')
      effects.exit('externalId')
      effects.exit('externalLink')
      return close(code)
    }

    effects.consume(code)
    return externalId
  }

  /* Consume any leftover }s */
  function close(code: Code) {
    if (code === rightBrace) {
      effects.consume(code)
      return close
    }
    return ok(code)
  }
}

/**
 * Helpers for compiling emitted tokens into AST nodes
 */
function enterExternalLink(this: CompileContext, token: Token) {
  this.enter(
    {
      type: 'externalLink',
      data: {
        hName: 'external-link',
        hProperties: {},
      },
    } as any,
    token,
  )
  this.buffer()
}

function enterExternalKind(this: CompileContext, _token: Token) {
  this.buffer()
}

function exitExternalKind(this: CompileContext, _token: Token) {
  const kind = this.resume()
  const node: any = this.stack[this.stack.length - 2]
  node.data.hProperties.kind = kind
}

function enterExternalId(this: CompileContext, _token: Token) {
  this.buffer()
}

function exitExternalId(this: CompileContext, _token: Token) {
  const id = this.resume()
  const node: any = this.stack[this.stack.length - 2]
  node.data.hProperties.id = id
}

function exitExternalLink(this: CompileContext, token: Token) {
  this.resume()
  this.exit(token)
}

function enterInternalLink(this: CompileContext, token: Token) {
  this.enter<any>(
    {
      type: 'internalLink',
      data: {
        hName: 'internal-link',
        hProperties: {
          kind: (token as any).kind,
        },
      },
    },
    token,
  )
  this.buffer()
}

function exitInternalLink(this: CompileContext, token: Token) {
  const id = this.resume()
  const node = this.exit(token)

  const data: any = node.data
  data.hProperties.id = id
}

/**
 * Register the plugin with micromark and unist
 */
const construct: Construct = {
  name: 'links',
  tokenize,
}

const syntax = {
  text: {
    [leftBrace]: construct,
  },
}

const fromMarkdown: FromMarkdownExtension = {
  enter: {
    externalKind: enterExternalKind,
    externalId: enterExternalId,
    externalLink: enterExternalLink,
    internalLink: enterInternalLink,
  },
  exit: {
    externalKind: exitExternalKind,
    externalId: exitExternalId,
    externalLink: exitExternalLink,
    internalLink: exitInternalLink,
  },
}

export const links: Plugin = function (this: Processor) {
  const data = this.data()

  add('micromarkExtensions', syntax)
  add('fromMarkdownExtensions', fromMarkdown)

  function add(field: string, value: unknown) {
    const list = data[field] ? data[field] : (data[field] = [])

    ;(list as unknown[]).push(value)
  }
}
