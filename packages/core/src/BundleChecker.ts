import { Space } from './Space'
import { Bundle } from './Bundle'
import { deduceTraits } from './Logic'

export type BundleCheckResult =
  | {
      kind: 'contradiction'
      contradiction: { properties: string[]; theorems: string[] }
    }
  | { kind: 'bundle'; bundle: Bundle }

export class BundleChecker {
  constructor(private readonly bundle: Bundle) {}

  check(space: Space): BundleCheckResult {
    const result = deduceTraits(
      this.bundle.implications,
      this.bundle.traitMap({ space }),
    )

    switch (result.kind) {
      case 'contradiction':
        return result
      case 'derivations':
        // TODO: consider if / how to add these
        // for the compile case, we don't want them in the final
        // bundle output, but this check is duplicative with the
        // viewer-side derivation loop
        return { kind: 'bundle', bundle: this.bundle }
    }
  }
}
