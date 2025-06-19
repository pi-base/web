import type { Handle } from '@sveltejs/kit'
import {
  AnalyticsReporter,
  getCountryFromRequest,
  withTiming,
  type AnalyticsEngineDataset,
} from './analytics.js'

// See https://kit.svelte.dev/docs/hooks#server-hooks
export const handle: Handle = async ({ event, resolve }) => {
  const startTime = performance.now()

  // Initialize Analytics Engine if available (in Cloudflare Workers environment)
  console.log({ platform: event.platform })
  const analyticsEngine = event.platform?.env?.ANALYTICS_ENGINE as
    | AnalyticsEngineDataset
    | undefined
  const analytics = new AnalyticsReporter(analyticsEngine)

  // Extract request information for metrics
  const method = event.request.method
  const url = new URL(event.request.url)
  const endpoint = url.pathname
  const userAgent = event.request.headers.get('User-Agent') || undefined
  const country = getCountryFromRequest(event.request)

  try {
    // Wrap the resolve function with timing
    const timedResolve = withTiming(
      (evt: typeof event, options: Parameters<typeof resolve>[1]) =>
        resolve(evt, options),
      duration => {
        // This will be called when resolve completes
        console.log(
          `Request ${method} ${endpoint} took ${duration.toFixed(2)}ms`,
        )
      },
    )

    const response = await timedResolve(event, {
      // We use the `etag` header from S3 to determine whether the bundle has
      // changed (and deduction needs to be re-run), so we need to preserve it.
      filterSerializedResponseHeaders(name, _value) {
        return name === 'etag'
      },
    })

    // Calculate total duration and report metrics
    const totalDuration = performance.now() - startTime

    analytics.reportWorkerMetrics({
      duration: totalDuration,
      endpoint,
      method,
      status: response.status,
      userAgent,
      country,
      timestamp: Date.now(),
    })

    // Report additional custom metrics based on response characteristics
    if (response.status >= 400) {
      analytics.reportCustomMetric('error_count', 1, {
        status: response.status.toString(),
        endpoint,
        method,
      })
    }

    if (totalDuration > 1000) {
      // Slow requests > 1 second
      analytics.reportCustomMetric('slow_request_count', 1, {
        endpoint,
        method,
        duration_bucket: totalDuration > 5000 ? 'very_slow' : 'slow',
      })
    }

    return response
  } catch (error) {
    const totalDuration = performance.now() - startTime

    // Report error metrics
    analytics.reportWorkerMetrics({
      duration: totalDuration,
      endpoint,
      method,
      status: 500,
      userAgent,
      country,
      timestamp: Date.now(),
    })

    analytics.reportCustomMetric('exception_count', 1, {
      endpoint,
      method,
      error_type: error instanceof Error ? error.name : 'unknown',
    })

    throw error
  }
}
