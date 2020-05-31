// Runs the given function on the leading AND trailing edges
// of activity, always at least +wait+ apart.
export function debounce<T>(f: (t: T) => void, wait = 1000) {
  let timeout: NodeJS.Timeout | null

  return function debounced(t: T) {
    if (timeout) {
      clearTimeout(timeout)
    } else {
      f(t)
    }
    timeout = setTimeout(() => {
      f(t)
      timeout = null
    }, wait)
  }
}
