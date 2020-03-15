import { Id, Implication } from './Types'
import ImplicationIndex from './ImplicationIndex'

export default class Queue {
  private index: ImplicationIndex
  private queue: Set<Implication>

  constructor(index: ImplicationIndex) {
    this.index = index
    this.queue = new Set(index.all)
  }

  mark(property: Id) {
    this.index.withProperty(property).forEach((i: Implication) => this.queue.add(i))
  }

  shift(): Implication | undefined {
    const item = this.queue.values().next().value
    if (item) { this.queue.delete(item) }
    return item
  }
}
