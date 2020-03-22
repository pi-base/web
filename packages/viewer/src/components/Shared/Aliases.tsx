import React from 'react'

interface Props {
  names: string[]
}

export default function Aliases({
  names = []
}: Props) {
  if (!names || names.length === 0) { return null }

  return (
    <>
      <small>or {names.join(', ')}</small>
    </>
  )
}
