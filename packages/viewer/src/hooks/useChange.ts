import { useRef } from 'react'

// useMemo is a performance optimization only, and doesn't provide any semantic
// guarantee that the memoized method won't be called additional times. Prefer
// useChange in cases where you want to ensure that a callback is called exactly
// once when its dependencies change.
export default function useChange<T>(value: T, callback: (current: T) => void) {
  const ref = useRef(value)
  if (ref.current !== value) {
    ref.current = value
    callback(value)
  }
}