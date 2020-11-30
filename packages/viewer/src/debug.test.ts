import { Event, trace } from './debug'

describe('trace', () => {
  it('logs for every event', () => {
    const events: Event[] = [
      { event: 'remote_fetch_started', host: 'host', branch: 'branch' },
      { event: 'remote_fetch_complete', result: null },
      { event: 'bundle_unchanged', etag: 'etag' },
      { event: 'checkout', branch: 'branch' },
      { event: 'set_host', host: 'host' },
    ]

    let logs = 0
    events.forEach(e => trace(e, () => (logs += 1)))

    expect(logs).toEqual(events.length)
  })
})
