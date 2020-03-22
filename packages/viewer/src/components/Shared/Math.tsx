import React, { useEffect, useRef } from 'react'
import katex from 'katex'

interface Props {
  inline?: boolean
  formula: string
}

export default function Math({ formula }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(
    () => {
      if (ref.current) {
        katex.render(
          formula,
          ref.current,
          {
            throwOnError: false
          }
        )
      }
    },
    [formula]
  )

  return (
    <span ref={ref}>{formula}</span>
  )
}
