import type { Data, Source } from '../types'

export interface ILocal {
  source?: Source
  data?: Data
  synced?: Date
}

export class Local implements ILocal {
  private storage: Storage

  constructor(storage: Storage = localStorage) {
    this.storage = storage
  }

  get source(): Source | undefined {
    return this.load('source')
  }

  set source(source: Source | undefined) {
    this.save('source', source)
  }

  get data(): Data | undefined {
    return this.load('data')
  }

  set data(value: Data | undefined) {
    this.save('data', value)
  }

  get synced(): Date | undefined {
    return new Date(this.load('synced'))
  }

  set synced(value: Date | undefined) {
    this.save('synced', value)
  }

  private load(key: string) {
    const loaded = this.storage.getItem(`pi-base.${key}`)
    return loaded && JSON.parse(loaded)
  }

  private save(key: string, value: unknown) {
    this.storage.setItem(`pi-base.${key}`, JSON.stringify(value))
  }
}
