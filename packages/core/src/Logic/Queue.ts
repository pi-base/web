import { Id, Implication } from './Types'
import ImplicationIndex from './ImplicationIndex'

export default class Queue<T extends Implication> {
  private index: ImplicationIndex<T>
  private queue: Set<T>

  constructor(index: ImplicationIndex<T>) {
    this.index = index
    this.queue = new Set(index.all)
  }

  mark(property: Id) {
    this.index.withProperty(property).forEach(i => this.queue.add(i))
  }

  shift(): Implication | undefined {
    const item = this.queue.values().next().value
    if (item) { this.queue.delete(item) }
    return item
  }
}
