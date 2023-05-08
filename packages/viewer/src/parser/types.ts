export type Finder<T> = {
  find(id: number): T | null
}
