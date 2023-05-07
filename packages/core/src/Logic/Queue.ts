import { Implication } from './Types.js'
import ImplicationIndex from './ImplicationIndex.js'

export default class Queue<
  TheoremId,
  PropertyId,
  Theorem extends Implication<TheoremId, PropertyId>,
> {
  private index: ImplicationIndex<TheoremId, PropertyId, Theorem>
  private queue: Set<Theorem>

  constructor(index: ImplicationIndex<TheoremId, PropertyId, Theorem>) {
    this.index = index
    this.queue = new Set(index.all)
  }

  mark(property: PropertyId): void {
    this.index.withProperty(property).forEach(i => this.queue.add(i))
  }

  shift(): Theorem | undefined {
    const result = this.queue.values().next()
    if (result.done) {
      return
    }

    this.queue.delete(result.value)
    return result.value
  }
}
