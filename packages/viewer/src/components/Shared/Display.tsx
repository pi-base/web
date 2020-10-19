/// <reference path="Display.d.ts"/>
import React, { useMemo } from 'react'
import rehype2react from 'rehype-react'

import { Parser } from '@pi-base/core'

import Citation, { InternalLink } from './Citation'
import Math from './Math'

function gather(nodes: any[], to: number) {
  let length = 0
  let acc = []

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i]

    if (node.type === 'text') {
      if (node.value.length + length >= to) {
        const fragment = node.value.slice(0, to - length - node.value.length) + '...'
        acc.push({ ...node, value: fragment })
        return acc
      } else {
        acc.push(node)
        length = length + node.value.length + 1
      }
    } else {
      if (length + 3 >= to) {
        acc.push(node)
        acc.push({ type: 'text', value: '...' })
        return acc
      } else {
        acc.push(node)
        length = length + 3
      }
    }
  }

  return acc
}

function truncate(this: any, to: number = 100) {
  return function transformer(tree: any) {
    const node = tree.children[0]
    return { ...node, children: gather(node.children, to) }
  }
}

const sharedComponents = {
  citation: Citation,
  inlineMath: Math,
  internalLink: InternalLink
}

const parsePreview = Parser()
  .use(truncate)
  .use(
    rehype2react,
    {
      createElement: React.createElement,
      components: {
        ...sharedComponents,
        p: 'span'
      },
      Fragment: React.Fragment
    }
  )

const parseTitle = Parser()
  .use(
    rehype2react,
    {
      createElement: React.createElement,
      components: {
        ...sharedComponents,
        p: 'span'
      },
      Fragment: React.Fragment
    }
  )

const parseDisplay = Parser()
  .use(
    rehype2react,
    {
      createElement: React.createElement,
      components: sharedComponents,
      Fragment: React.Fragment
    }
  )

export function Preview({ body }: { body: string }) {
  const contents = useMemo(
    () => parsePreview.processSync(body).contents,
    [body]
  )
  return (<>{contents}</>)
}

export function Title({ body }: { body: string }) {
  const contents = useMemo(
    () => parseTitle.processSync(body).contents,
    [body]
  )
  return (<>{contents}</>)
}

export default function Display({ body }: { body: string }) {
  const contents = useMemo(
    () => parseDisplay.processSync(body).contents,
    [body]
  )
  return (<>{contents}</>)
}
