import React from 'react'

const prefix = /^\w0*/

export default function Id({ value }: { value: string }) {
  return <>{value.replace(prefix, '')}</>
}