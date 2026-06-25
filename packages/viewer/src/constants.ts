const {
  VITE_BUNDLE_HOST = 'https://pub-65041ca69d744da88ade13abd31ad834.r2.dev', // TODO: push down to @pi-base/core?
  VITE_BUNDLE_SSE = 'false',
  VITE_BRANCH = 'unknown',
  VITE_MAIN_BRANCH = 'main',
  VITE_VERSION = 'unknown',
  VITE_CATEGORY = 'topology',
} = import.meta.env

interface CategoryConfig {
  category: string
  objects: string
  subject: string
  slogan: string
  citeTitle: string
  contributingUrl: string
  helpUrl: string
  sentryUrl: string
  calloutFeatures: string[]
  homeContent: string
  showQuestions: boolean
  footer: (currentYear: string) => string
  acknowledgement?: {
    quote: string
    footer: string
    dedication: string
  }
}

const topologyConfig: CategoryConfig = {
  category: 'topology',
  objects: 'Spaces',
  subject: 'Topology',
  slogan: 'a community database of topological counterexamples',
  citeTitle:
    'π-Base Topology: a community database of topological counterexamples',
  contributingUrl:
    'https://code4math.zulipchat.com/#narrow/channel/416467-pi-base/topic/Welcome.20new.20and.20potential.20contributors!.20.F0.9F.91.8B/with/544214230',
  helpUrl: 'https://github.com/pi-base/data/wiki/',
  sentryUrl:
    'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960',
  calloutFeatures: [
    'Search spaces by name/description: [compactifications](https://topology.pi-base.org/spaces?text=compactification)',
    'Search spaces by properties: [non-metric continua](https://topology.pi-base.org/spaces?q=compact%20%2B%20connected%20%2B%20t_2%20%2B%20~metrizable)',
    'Find counterexamples: [connected spaces need not be path connected](https://topology.pi-base.org/theorems/T000040)',
  ],
  homeContent: `
### Contributing

π-Base's data and software are open-sourced on [GitHub](https://github.com/pi-base/).
We rely on [volunteers like yourself](https://github.com/pi-base/data/graphs/contributors)
to [contribute]({contributingUrl}) new spaces, properties, and theorems.

### About Us

The π-Base was founded in 2014 by its lead maintainer [James Dabbs](https://github.com/jamesdabbs).
π-Base's lead mathematical editor [Steven Clontz](https://clontz.org) joined the project in 2017.

In 2026, [the π-Base project](https://pi-base.org) officially expanded to serve disciplines beyond topology.

### Community

The topology π-Base would not be possible without the volunteer efforts of our numerous
[contributors](https://github.com/pi-base/data/graphs/contributors).

The π-Base is part of the [code4math](https://code4math.org) community.
Join the conversation on our
[code4math Zulip channel](https://code4math.zulipchat.com/#narrow/channel/416467-pi-base).

More databases may be discovered at the [Index of Mathematical DataBases](https://mathbases.org/).

### Special Acknowledgements

Many people have contributed to this project, but a few individuals and organizations deserve particular recognition:

*   Steen and Seebach for writing the inspiration for this project, 
    [Counterexamples in Topology](https://en.wikipedia.org/wiki/Counterexamples_in_Topology).
*   [Scott Varagona](http://www.montevallo.edu/staff-bio/scott-varagona/) for his heroic work serializing
    *Counterexamples* into the first version of the π-Base.
*   Steven and James' graduate advisor, [Gary Gruenhage](http://www.auburn.edu/~gruengf/), for all his support
    and guidance.
*   [Austin Mohr](http://austinmohr.com/home/) for his work and feedback using the π-Base as a pedagogical tool
    and promoting us on [Math.StackExchange](https://math.stackexchange.com).
*   Funding from the [University of South Alabama](https://www.southalabama.edu/) Faculty Development Council
    from 2017-2018.`,
  showQuestions: true,
  footer: currentYear => `
Data © ${currentYear} Steven Clontz and James Dabbs ([CC-BY](https://github.com/pi-base/data/blob/main/LICENSE.md)) |
Software © ${currentYear} James Dabbs ([MIT License](https://github.com/pi-base/web/blob/main/LICENSE.md)) |
[GitHub](https://github.com/pi-base)`,
  acknowledgement: {
    quote:
      'Topology is a dense forest of counterexamples. A usable map of the forest is a fine thing.',
    footer:
      "Paraphrased from Mary Ellen Rudin's review of *Counterexamples in Topology*",
    dedication:
      'Dedicated to the memory of our friend and mentor Gary Gruenhage (1947-2023).',
  },
}

const graphConfig: CategoryConfig = {
  category: 'graph',
  objects: 'Graphs',
  subject: 'Graph Theory',
  slogan: 'a community database of graph classes',
  citeTitle: 'π-Base Graph Theory',
  contributingUrl: 'TODO',
  helpUrl: 'https://github.com/pi-base/data-graph/wiki/',
  sentryUrl: 'TODO',
  calloutFeatures: ['graphs are neat'],
  homeContent: '# Contributing ...',
  showQuestions: false,
  footer: () => '',
}

export const categoryConfig =
  VITE_CATEGORY === 'graph' ? graphConfig : topologyConfig

export const mainBranch = VITE_MAIN_BRANCH
export const defaultHost = VITE_BUNDLE_HOST

export const build = {
  branch: VITE_BRANCH,
  version: VITE_VERSION,
}

export const bundleSse = VITE_BUNDLE_SSE === 'true'

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
