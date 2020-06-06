import { useEffect, useState } from 'react'

function compare(direction: 'asc' | 'desc' | null, a: any, b: any) {
  if (a === b) {
    return 0
  }

  return (direction === 'asc' ? 1 : -1) * (a > b ? 1 : -1)
}

export default function useSort<T>(items: T[]) {
  const [field, setField] = useState<keyof T | null>(null)
  const [direction, setDirection] = useState<'asc' | 'desc' | null>(null)
  const [sorted, setSorted] = useState<T[]>(items)

  function sort(key: string) {
    if (key === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc')
    } else {
      setDirection('asc')
      setField(key as keyof T)
    }
  }

  useEffect(() => {
    setDirection(null)
    setField(null)
    setSorted(items)
  }, [items])

  useEffect(() => {
    if (!field || !direction) {
      setSorted(items)
    } else {
      setSorted(
        items.sort((a: T, b: T) => compare(direction, a[field], b[field]))
      )
    }
  }, [direction, field, items])

  return {
    sort,
    sorted,
  }
}
