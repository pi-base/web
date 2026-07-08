import { z } from 'zod'
import { Bundle, Version } from './Bundle.js'
import { formulaSchema } from './Formula.js'
import { Id } from './Id.js'
import { Derivations, ImplicationIndex, deduceTraits } from './Logic/index.js'
import { Result } from './Logic/Prover.js'
import { refSchema } from './Ref.js'
import { proofSchema } from './Trait.js'

// The derived-data artifact set is the precomputed representation of a bundle
// that `compile` publishes and consumers (notably the viewer) can load without
// re-running the prover. See doc/artifacts.md for the format contract.

// Bump when the serialized shape of any artifact changes incompatibly.
// Consumers should check this before assuming they can read the other paths.
export const FORMAT = 1

const versionSchema = z.object({ ref: z.string(), sha: z.string() })

export const manifestSchema = z.object({
  format: z.number().int().positive(),
  version: versionSchema,
  paths: z.object({
    core: z.string(),
    text: z.string(),
    // Template for per-space artifacts, with `{id}` standing in for the
    // space's uid - e.g. `spaces/{id}.json`
    spaces: z.string(),
  }),
})

export type Manifest = z.infer<typeof manifestSchema>

// Everything needed to run deductions (and render lists and search): names,
// formulas and asserted trait values, but no descriptions or refs.
export const coreArtifactSchema = z.object({
  properties: z.array(
    z.object({
      uid: z.string(),
      name: z.string(),
      aliases: z.array(z.string()),
      counterexamples_id: z.number().optional().nullable(),
    }),
  ),
  spaces: z.array(
    z.object({
      uid: z.string(),
      name: z.string(),
      aliases: z.array(z.string()),
      ambiguous_construction: z.boolean().optional(),
      counterexamples_id: z.number().optional().nullable(),
    }),
  ),
  theorems: z.array(
    z.object({
      uid: z.string(),
      when: formulaSchema(z.string()),
      then: formulaSchema(z.string()),
      converse: z.array(z.string()).optional().nullable(),
      counterexamples_id: z.number().optional().nullable(),
    }),
  ),
  traits: z.array(
    z.object({
      space: z.string(),
      property: z.string(),
      value: z.boolean(),
    }),
  ),
  version: versionSchema,
})

export type CoreArtifact = z.infer<typeof coreArtifactSchema>

// The traits derivable for a single space from the asserted traits in the
// corresponding core artifact, with proofs
export const spaceArtifactSchema = z.object({
  space: z.string(),
  traits: z.array(
    z.object({
      property: z.string(),
      value: z.boolean(),
      proof: proofSchema(z.string()),
    }),
  ),
  version: versionSchema,
})

export type SpaceArtifact = z.infer<typeof spaceArtifactSchema>

const entityTextSchema = z.object({
  uid: z.string(),
  description: z.string(),
  refs: z.array(refSchema),
})

// Descriptions and refs, which are only read on detail pages
export const textArtifactSchema = z.object({
  properties: z.array(entityTextSchema),
  spaces: z.array(entityTextSchema),
  theorems: z.array(entityTextSchema),
  traits: z.array(
    z.object({
      space: z.string(),
      property: z.string(),
      description: z.string(),
      refs: z.array(refSchema),
    }),
  ),
  version: versionSchema,
})

export type TextArtifact = z.infer<typeof textArtifactSchema>

export type Artifacts = {
  manifest: Manifest
  core: CoreArtifact
  text: TextArtifact
  spaces: Map<Id, SpaceArtifact>
}

// Prover inputs feed directly into derived proofs, so producing reproducible
// artifacts requires pinning theorem and trait iteration order (here, by uid).
export function implications(bundle: Bundle): ImplicationIndex<Id, Id> {
  return new ImplicationIndex(
    sortByUid([...bundle.theorems.values()]).map(({ uid, when, then }) => ({
      id: uid,
      when,
      then,
    })),
  )
}

export function deduceSpace(
  bundle: Bundle,
  space: Id,
  index: ImplicationIndex<Id, Id> = implications(bundle),
): Result<Id, Id> {
  const asserted = [...bundle.traits.values()]
    .filter(trait => trait.space === space)
    .sort((a, b) => compare(a.property, b.property))

  return deduceTraits(
    index,
    new Map(asserted.map(({ property, value }) => [property, value])),
  )
}

export function serialize(
  bundle: Bundle,
  deductions: Map<Id, Derivations<Id, Id>>,
): Artifacts {
  return {
    manifest: manifest(bundle.version),
    core: coreArtifact(bundle),
    text: textArtifact(bundle),
    spaces: new Map(
      [...deductions.entries()]
        .sort(([a], [b]) => compare(a, b))
        .map(([space, derivations]) => [
          space,
          spaceArtifact(bundle, space, derivations),
        ]),
    ),
  }
}

export function manifest(version: Version): Manifest {
  return manifestSchema.parse({
    format: FORMAT,
    version,
    paths: {
      core: 'core.json',
      text: 'text.json',
      spaces: 'spaces/{id}.json',
    },
  })
}

// Resolve the manifest's per-space path template for a given space
export function spacePath(manifest: Manifest, space: Id): string {
  return manifest.paths.spaces.replace('{id}', space)
}

// The zod parses below both validate the shapes and canonicalize the output:
// object schemas strip fields that don't belong in the artifact (description,
// refs) and emit keys in schema order, so serialization is deterministic even
// if input objects vary in field order.
export function coreArtifact(bundle: Bundle): CoreArtifact {
  return coreArtifactSchema.parse({
    properties: sortByUid([...bundle.properties.values()]),
    spaces: sortByUid([...bundle.spaces.values()]),
    theorems: sortByUid([...bundle.theorems.values()]),
    traits: sortTraits([...bundle.traits.values()]),
    version: bundle.version,
  })
}

export function spaceArtifact(
  bundle: Bundle,
  space: Id,
  derivations: Derivations<Id, Id>,
): SpaceArtifact {
  return spaceArtifactSchema.parse({
    space,
    traits: derivations.all().sort((a, b) => compare(a.property, b.property)),
    version: bundle.version,
  })
}

export function textArtifact(bundle: Bundle): TextArtifact {
  return textArtifactSchema.parse({
    properties: sortByUid([...bundle.properties.values()]),
    spaces: sortByUid([...bundle.spaces.values()]),
    theorems: sortByUid([...bundle.theorems.values()]),
    traits: sortTraits([...bundle.traits.values()]),
    version: bundle.version,
  })
}

// Plain codepoint comparison; localeCompare varies by environment
function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function sortByUid<T extends { uid: string }>(collection: T[]): T[] {
  return collection.sort((a, b) => compare(a.uid, b.uid))
}

function sortTraits<T extends { space: string; property: string }>(
  collection: T[],
): T[] {
  return collection.sort(
    (a, b) => compare(a.space, b.space) || compare(a.property, b.property),
  )
}
