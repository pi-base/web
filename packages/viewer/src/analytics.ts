/**
 * Cloudflare Workers Analytics Engine integration utility
 */

export interface AnalyticsEngineDataset {
  writeDataPoint(data: AnalyticsDataPoint): void
}

export interface AnalyticsDataPoint {
  blobs?: (string | null)[]
  doubles?: number[]
  indexes?: (string | null)[]
}

export interface WorkerMetrics {
  duration: number
  endpoint: string
  method: string
  status: number
  userAgent?: string
  country?: string
  timestamp: number
}

/**
 * Helper class for sending metrics to Cloudflare Analytics Engine
 */
export class AnalyticsReporter {
  private analyticsEngine: AnalyticsEngineDataset | null = null

  constructor(analyticsEngine?: AnalyticsEngineDataset) {
    this.analyticsEngine = analyticsEngine || null
  }

  /**
   * Report worker execution metrics to Analytics Engine
   */
  reportWorkerMetrics(metrics: WorkerMetrics): void {
    if (!this.analyticsEngine) {
      // In development or when Analytics Engine is not available
      console.log('Worker Metrics:', metrics)
      return
    }

    try {
      this.analyticsEngine.writeDataPoint({
        // Indexed fields (can be queried and filtered)
        indexes: [
          metrics.endpoint, // index[1]: endpoint path
          metrics.method, // index[2]: HTTP method
          metrics.status.toString(), // index[3]: status code
          metrics.country || null, // index[4]: user country
        ],
        // Blob fields (string data)
        blobs: [
          metrics.userAgent || null, // blob[1]: user agent
        ],
        // Double fields (numeric data for aggregation)
        doubles: [
          metrics.duration, // double[1]: duration in milliseconds
          metrics.timestamp, // double[2]: timestamp
        ],
      })
    } catch (error) {
      console.error('Failed to report analytics:', error)
    }
  }

  /**
   * Report custom metrics to Analytics Engine
   */
  reportCustomMetric(
    name: string,
    value: number,
    tags: Record<string, string | null> = {},
  ): void {
    if (!this.analyticsEngine) {
      console.log('Custom Metric:', { name, value, tags })
      return
    }

    try {
      const indexes = [name, null, null, null] // Start with metric name
      const tagKeys = Object.keys(tags).slice(0, 3) // Limit to 3 additional tags

      tagKeys.forEach((key, index) => {
        indexes[index + 1] = tags[key]
      })

      this.analyticsEngine.writeDataPoint({
        indexes: indexes as (string | null)[],
        doubles: [value, Date.now()],
        blobs: [null],
      })
    } catch (error) {
      console.error('Failed to report custom metric:', error)
    }
  }
}

/**
 * Extract country from Cloudflare request headers
 */
export function getCountryFromRequest(request: Request): string | undefined {
  return request.headers.get('CF-IPCountry') || undefined
}

/**
 * Create a performance timing wrapper for functions
 */
export function withTiming<T extends unknown[], R>(
  fn: (...args: T) => R | Promise<R>,
  onComplete: (duration: number) => void,
): (...args: T) => R | Promise<R> {
  return (...args: T) => {
    const startTime = performance.now()

    const handleComplete = (result: R) => {
      const duration = performance.now() - startTime
      onComplete(duration)
      return result
    }

    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result.then(handleComplete).catch(error => {
          const duration = performance.now() - startTime
          onComplete(duration)
          throw error
        })
      } else {
        return handleComplete(result)
      }
    } catch (error) {
      const duration = performance.now() - startTime
      onComplete(duration)
      throw error
    }
  }
}
