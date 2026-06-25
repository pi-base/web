const {
  VITE_BUNDLE_HOST = 'https://pub-65041ca69d744da88ade13abd31ad834.r2.dev', // TODO: push down to @pi-base/core?
  VITE_BUNDLE_SSE = 'false',
  VITE_BRANCH = 'unknown',
  VITE_MAIN_BRANCH = 'main',
  VITE_VERSION = 'unknown',
  VITE_CATEGORY = 'topology'
} = import.meta.env

interface CategoryConfig {
  category: string
  objects: string
  dataHost: string
  contributingUrl: string
  helpUrl: string
  calloutFeatures: string[]
  homeContent: string
  showQuestions: boolean
  acknowledgement?: {
    quote: string
    footer: string
    dedication: string
  }
}

const topologyConfig:CategoryConfig = {
  category: "topology",
  objects: "Spaces",
  dataHost: "https://pub-65041ca69d744da88ade13abd31ad834.r2.dev",
  contributingUrl: "https://code4math.zulipchat.com/#narrow/channel/416467-pi-base/topic/Welcome.20new.20and.20potential.20contributors!.20.F0.9F.91.8B/with/544214230",
  helpUrl: "https://github.com/pi-base/data/wiki/",
  calloutFeatures: [
    "Search spaces by name/description: [compactifications](https://topology.pi-base.org/spaces?text=compactification)",
    "Search spaces by properties: [non-metric continua](https://topology.pi-base.org/spaces?q=compact%20%2B%20connected%20%2B%20t_2%20%2B%20~metrizable)",
    "Find counterexamples: [connected spaces need not be path connected](https://topology.pi-base.org/theorems/T000040)",
  ],
  homeContent: "# Contributing ...",
  showQuestions: true,
  acknowledgement: {
    quote: "Topology is a dense forest of counterexamples. A usable map of the forest is a fine thing.",
    footer: "Paraphrased from Mary Ellen Rudin's review of *Counterexamples in Topology*",
    dedication: "Dedicated to the memory of our friend and mentor Gary Gruenhage (1947-2023)."
  },
}

const graphConfig:CategoryConfig = {
  category: "graph",
  objects: "Graphs",
  dataHost: "TODO",
  contributingUrl: "TODO",
  helpUrl: "https://github.com/pi-base/data-graph/wiki/",
  calloutFeatures: [
    "graphs are neat"
  ],
  homeContent: "# Contributing ...",
  showQuestions: false,
}

export const categoryConfig = VITE_CATEGORY === "graph" ? graphConfig : topologyConfig

export const mainBranch = VITE_MAIN_BRANCH
export const defaultHost = VITE_BUNDLE_HOST

export const build = {
  branch: VITE_BRANCH,
  version: VITE_VERSION,
}

export const bundleSse = VITE_BUNDLE_SSE === 'true'

export const contributingUrl = `https://code4math.zulipchat.com/#narrow/channel/416467-pi-base/topic/Welcome.20new.20and.20potential.20contributors!.20.F0.9F.91.8B/with/544214230`
export const helpUrl = `https://github.com/pi-base/data/wiki/`
export const sentryIngest =
  'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960'

// Used for Fuse searches
export const searchWeights = {
  id: 3,
  name: 1,
  aliases: 0.7,
  description: 0.3,
}
export const searchKeys = [
  { name: 'id', weight: searchWeights.id, getFn: (s: any) => `${s.id}` },
  { name: 'name', weight: searchWeights.name },
  { name: 'aliases', weight: searchWeights.aliases },
  { name: 'description', weight: searchWeights.description },
]
export const searchThreshold = 0.3
