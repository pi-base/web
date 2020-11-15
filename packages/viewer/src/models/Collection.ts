import Id from './Id'

export default class Collection<Value, Input = number | string, Key = number> {
  private index: Map<Key, Value>
  private normalize: (input: Input) => Key

  static byId<T extends { id: number }>(values: T[]): Collection<T> {
    return new this(
      values,
      (value) => value.id,
      (input: number | string) => {
        if (typeof input === 'string') {
          return Id.toInt(input)
        } else {
          return input
        }
      },
    )
  }

  static empty<T>(): Collection<T> {
    return new this(
      [],
      () => 0,
      () => 0,
    )
  }

  constructor(
    values: Value[],
    index: (value: Value) => Key,
    normalize: (input: Input) => Key,
  ) {
    this.index = new Map(values.map((value) => [index(value), value]))
    this.normalize = normalize
  }

  get all() {
    return [...this.index.values()]
  }

  find(i: Input): Value | null {
    return this.index.get(this.normalize(i)) || null
  }
}
