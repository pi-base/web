import { browser, building } from '$app/environment'
import createDebug from 'debug'

export const debug = createDebug('pi-base:viewer')

// The structured schema we emit to Workers Logs during runtime SSR. Each event
// is one queryable log entry; `requestId` ($metadata.requestId) lets us join
// these back to the platform's own per-invocation telemetry (cpuTimeMs,
// wallTimeMs) so any field below can slice those numbers.
//
// Timing note: on Workers `Date.now()` is clamped and only advances after I/O,
// so wall-clock deltas around *CPU-bound* work read as ~0. We therefore record
// reliable counts (and the platform's cpuTimeMs) rather than home-rolled CPU
// timers; the one `ms` we keep (`bundle_sync`) wraps a real network fetch, where
// the clock does advance.
export type ServerEvent =
  | {
      // One per SSR Worker invocation (static assets bypass the Worker). Carries
      // the SvelteKit route *pattern* — which the platform telemetry can't give
      // us — plus the isolate cold flag and Cloudflare's verified bot category.
      evt: 'request'
      routeId: string | null
      method: string
      status: number
      cold: boolean
      botCategory: string | null
    }
  | {
      // One per bundle sync. `changed` is true on a 200 (full parse+transform),
      // false on a 304. Counts size the parse/transform work; `ms` is the (valid)
      // network fetch duration.
      evt: 'bundle_sync'
      changed: boolean
      spaces: number
      properties: number
      theorems: number
      traits: number
      ms: number
    }
  | {
      // One per deduction run, logged synchronously at run *start*. `planned` is
      // the number of spaces the run intends to deduce — the reliable proxy for
      // deduction work, since the eager run finishes after the SSR response is
      // sent, so a completion-time count is dropped. `reset` marks a full re-run
      // (e.g. from a refresh) vs an incremental top-up.
      evt: 'deduce_run'
      planned: number
      reset: boolean
    }

// Emit one structured Workers Logs event. We log the *object* (not a JSON
// string) so Workers Logs indexes each field as a queryable key, the same way
// the platform's `$workers.*` fields are. No-ops in the browser so we don't spam
// the client console, and while prerendering so logs reflect only real runtime
// invocations — use `debug`/`trace` for client-side tracing.
export function serverLog(event: ServerEvent): void {
  if (browser || building) {
    return
  }

  console.log({ source: 'pi-base:viewer', ...event })
}

// Cold-start latch for the current Worker isolate. Module state survives across
// requests in a warm isolate, so the first read returns true (this isolate just
// booted: full JS init + first bundle parse) and every later request reads
// false. Read it from exactly one place per request (hooks.server.ts) so the
// latch flips once; combined with the platform's per-invocation cpuTimeMs this
// separates one-time isolate/parse cost from steady-state request cost.
let warmed = false
export function isolateCold(): boolean {
  if (warmed) {
    return false
  }
  warmed = true
  return true
}

export type Event =
  | { event: 'remote_fetch_started'; host: string; branch: string }
  | { event: 'remote_fetch_complete'; result: unknown }
  | { event: 'bundle_unchanged'; etag: string }
  | { event: 'checkout'; branch: string }
  | { event: 'set_host'; host: string }
  | { event: 'build_typesetter' }

type Logger = (message: string, ...args: unknown[]) => any

export function trace(payload: Event, log: Logger = debug) {
  const { event, ...rest } = payload

  switch (event) {
    case 'remote_fetch_started':
      return log('Syncing with remote', rest)
    case 'remote_fetch_complete':
      return log('Fetched', rest)
    case 'bundle_unchanged':
      return log('Local bundle is up to date', rest)
    case 'checkout':
      return log('Checking out', rest)
    case 'set_host':
      return log('Setting host', rest)
    case 'build_typesetter':
      return log('Rebuilding typesetter')
  }
}
