import type {
  CompileContext,
  Extension as FromMarkdownExtension,
} from 'mdast-util-from-markdown'
import type { Code, Construct, Token, Tokenizer } from 'micromark-util-types'
import type { Plugin, Processor } from 'unified'
import createDebug from 'debug'

import { ExternalLinkNode, InternalLinkNode } from './types'

const debug = createDebug('pi-base:links')

/**
 * Extends the Markdown parser, adding support for tokenizing {internal} and
 * {{external}} links into InternalLinkNode and ExternalLinkNode tokens.
 *
 * See https://github.com/micromark/micromark#creating-a-micromark-extension for
 * details on the micromark extension API.
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
      return 'P'
    case 83: // S
    case 115: // s
      return 'S'
    case 84: // T
    case 116: // t
      return 'T'
    default:
      return null
  }
}

const tokenize: Tokenizer = (effects, ok, nok) => {
  debug('start tokenize')
  /* The tokenizer is a state machine that starts in the `start` state,
   * accumulating text and transitioning as described above the other states
   * below.
   */
  return start

  /* Consumes the single starting { */
  function start(code: Code) {
    debug('start %s', code)
    effects.enter('linkMarker')
    effects.consume(code)

    return internalOrExternal
  }

  /* Consumes a single character
   * - if {, parse the rest as an external link
   * - otherwise parse an interal link with kind determined by the consumed
   *   character [PST]
   */
  function internalOrExternal(code: Code) {
    debug('intenalOrExternal %s', code)
    if (code === leftBrace) {
      effects.consume(code)
      effects.exit('linkMarker')

      effects.enter('externalLink')
      effects.enter('externalKind')
      effects.enter('chunkString', { contentType: 'string' })
      return externalKind
    }

    effects.exit('linkMarker')
    effects.enter('internalKind')
    effects.consume(code)
    effects.exit('internalKind')
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
    debug('externalKind %s', code)
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === colon) {
      effects.exit('chunkString')
      effects.exit('externalKind')
      effects.enter('externalSeparator')
      effects.consume(code)
      effects.exit('externalSeparator')
      effects.enter('externalId')
      effects.enter('chunkString', { contentType: 'string' })
      return externalId
    }

    effects.consume(code)
    return externalKind
  }

  /* Consume word characters up to a }, then finalize */
  function internalId(code: Code) {
    debug('internalId %s', code)
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === rightBrace) {
      effects.exit('chunkString')
      effects.exit('internalLink')
      effects.enter('linkMarker')
      return close(code)
    }

    effects.consume(code)
    return internalId
  }

  /* Consume word characters up to a }, then finalize */
  function externalId(code: Code) {
    debug('externalId %s', code)
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === rightBrace) {
      effects.exit('chunkString')
      effects.exit('externalId')
      effects.exit('externalLink')
      effects.enter('linkMarker')
      return close(code)
    }

    effects.consume(code)
    return externalId
  }

  /* Consume any leftover }s */
  function close(code: Code) {
    debug('close %s', code)
    if (code === rightBrace) {
      effects.consume(code)
      return close
    }
    effects.exit('linkMarker')
    return ok(code)
  }
}

/**
 * Helpers for compiling emitted tokens into AST nodes
 *
 * The `as` castings here aren't ideal, but the MDAST types are very rigid and
 * expect a closed enum of Node types. The underlying implementation appears to
 * support `enter`ing other shapes of nodes, but we should be careful about this
 * breaking in dependency updates.
 *
 * TODO: improve error handling throughout here (i.e. don't silently ignore
 * typechecking errors)
 */
function enterExternalLink(this: CompileContext, token: Token) {
  this.enter<any>(
    {
      type: 'externalLink',
    } as Omit<ExternalLinkNode, 'id' | 'kind'>,
    token,
  )
  this.buffer()
}

function enterExternalKind(this: CompileContext, _token: Token) {
  this.buffer()
}

function exitExternalKind(this: CompileContext, _token: Token) {
  const kind = this.resume()
  const node: unknown = this.stack[this.stack.length - 2]
  if (isExternalLink(node) && isExternalKind(kind)) {
    node.kind = kind
  }
}

function enterExternalId(this: CompileContext, _token: Token) {
  this.buffer()
}

function exitExternalId(this: CompileContext, _token: Token) {
  const id = this.resume()
  const node: unknown = this.stack[this.stack.length - 2]
  if (isExternalLink(node)) {
    node.id = id
  }
}

function exitExternalLink(this: CompileContext, token: Token) {
  this.resume()
  this.exit(token)
}

function enterInternalLink(this: CompileContext, token: Token) {
  this.enter<any>(
    {
      type: 'internalLink',
      kind: (token as any).kind,
    } as Omit<InternalLinkNode, 'id'>,
    token,
  )
  this.buffer()
}

function exitInternalLink(this: CompileContext, token: Token) {
  const id = this.resume()
  const node: unknown = this.exit(token)
  if (isInternalLink(node)) {
    node.id = id
  }
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

function isExternalLink(node: any): node is ExternalLinkNode {
  return node && node.type === 'externalLink'
}

function isExternalKind(kind: any): kind is ExternalLinkNode['kind'] {
  return kind && ['doi', 'wikipedia', 'mr', 'mathse', 'mo', 'zbmath'].includes(kind)
}

function isInternalLink(node: any): node is InternalLinkNode {
  return node && node.type === 'internalLink'
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
