import { Implication } from './Types'
import ImplicationIndex from './ImplicationIndex'

export default class Queue<
  TheoremId,
  PropertyId,
  Theorem extends Implication<TheoremId, PropertyId>
> {
  private index: ImplicationIndex<TheoremId, PropertyId, Theorem>
  private queue: Set<Implication<TheoremId, PropertyId>>

  constructor(index: ImplicationIndex<TheoremId, PropertyId, Theorem>) {
    this.index = index
    this.queue = new Set(index.all)
  }

  mark(property: PropertyId): void {
    this.index.withProperty(property).forEach((i) => this.queue.add(i))
  }

  shift(): Theorem | undefined {
    const item = this.queue.values().next().value
    if (item) {
      this.queue.delete(item)
    }
    return item
  }
}
