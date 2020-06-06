import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'

export default function useQueryParam(
  key: string
): [string, (value: string) => void] {
  const history = useHistory()

  const set = useCallback(
    function set(value: string) {
      const query = new URLSearchParams(history.location.search)

      if (value) {
        query.set(key, value)
      } else {
        query.delete(key)
      }

      history.push({
        pathname: history.location.pathname,
        search: '?' + query.toString(),
      })
    },
    [history, key]
  )

  const value = useMemo(() => {
    const query = new URLSearchParams(history.location.search)
    return query.get(key) || ''
  }, [history.location.search, key])

  return [value, set]
}
