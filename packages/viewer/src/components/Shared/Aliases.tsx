import React from 'react'

interface Props {
  names: string[]
}

export default function Aliases({
  names = []
}: Props) {
  if (!names || names.length === 0) { return null }

  const children = [<span className="text-muted" key={0}> or </span>]
  names.forEach((name, i) => {
    children.push(
      <span key={2 * i + 1}>{name}</span>,
      <span key={2 * i + 2} className="text-muted">, </span>
    )
  })
  children.pop()

  return (
    <small>{children}</small>
  )
}
