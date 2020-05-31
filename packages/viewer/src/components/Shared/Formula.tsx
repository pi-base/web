import React from 'react'
import { Link } from 'react-router-dom'

import { Formula, formula } from '@pi-base/core'

import { Property, Store, useStore } from '../../models'
import paths from '../../paths'
import { Title } from './Display'

function intersperse(list: JSX.Element[], sep: string) {
  const result: JSX.Element[] = []
  for (let i = 0; i < list.length; i++) {
    result[2 * i] = <React.Fragment key={2 * i}>{list[i]}</React.Fragment>
    result[2 * i - 1] = <span key={2 * i - 1}>{` ${sep} `}</span>
  }
  return result
}

function render<P>(
  element: (p: P) => JSX.Element,
  formula: Formula<P>
): JSX.Element {
  switch (formula.kind) {
    case 'and':
      return (
        <>
          {'('}
          {
            intersperse(
              formula.subs.map(
                sf => render(element, sf)
              ),
              'Λ'
            )
          }
          {')'}
        </>
      )
    case 'or':
      return (
        <>
          {'('}
          {
            intersperse(
              formula.subs.map(
                sf => render(element, sf)
              ),
              '∨'
            )
          }
          {')'}
        </>
      )
    case 'atom':
      const prefix = formula.value === false ? '¬' : ''
      return (
        <>{prefix}{element(formula.property)}</>
      )
  }
}

export function Display({
  value,
  link = "none"
}: {
  value: Formula<Property>
  link?: "property" | "none"
}) {
  const format = link === "property"
    ? (p: Property) => <Link key={p.uid} to={paths.property(p)}><Title body={p.name}></Title></Link>
    : (p: Property) => <Title key={p.uid} body={p.name} />
  const i = 0

  return (<React.Fragment key={i}>{render(format, value)}</React.Fragment>)
}

export default function ({
  value,
  link = "none"
}: {
  value: Formula<string>
  link?: "property" | "none"
}) {
  const store = useStore()
  const resolved = formula.mapProperty((id: string) => Store.property(store, id)!, value)

  return (<Display value={resolved} link={link} />)
}
