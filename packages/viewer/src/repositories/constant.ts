import initial from './initial'

export default function constant(value = initial) {
  return {
    load() {
      return value
    },
    subscribe() {
      // no-op
    },
  }
}
