// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        ANALYTICS_ENGINE?: import('./src/analytics.js').AnalyticsEngineDataset
        // Add other Cloudflare environment variables as needed
        [key: string]: unknown
      }
      context: {
        waitUntil(promise: Promise<any>): void
      }
      caches: CacheStorage & { default: Cache }
    }
  }
}

export {}
