# Derived-data artifacts

The compiler publishes a bundle's data as a versioned set of artifacts, so
that consumers (notably the viewer) can load precomputed deductions instead of
re-running the prover, and can load only the slices of data a page actually
needs. Schemas and serialization live in `packages/core/src/Artifacts.ts`.

The legacy monolithic `bundle.json` continues to be published alongside these
artifacts and remains the stable public data API. Consumers without artifact
support (or reading a bundle predating them) fall back to it and derive traits
client-side.

## Artifact set

| Path               | Contents                                                     |
| ------------------ | ------------------------------------------------------------ |
| `manifest.json`    | Format version, data version (`ref`/`sha`), artifact paths   |
| `core.json`        | Deduction-minimal data: uids, names, aliases, theorem formulas, asserted trait values |
| `spaces/{id}.json` | Traits derivable for one space, with proofs                  |
| `text.json`        | Descriptions and refs for all entities and asserted traits   |

Paths are relative to the manifest's location and are declared in the
manifest, so consumers should discover them from `manifest.json` rather than
hard-coding. `paths.spaces` is a template in which `{id}` stands for a space's
uid.

Rationale for the split: descriptions and refs are ~85% of bundle bytes but
are only read on detail pages, while `core.json` alone supports lists, search,
and full client-side deduction. Derived traits with proofs are far too large
to ship whole (~8 MB raw) but shard to tens of KB per space.

## Format versioning

`manifest.json` carries a `format` number (`artifacts.FORMAT`). It is bumped
whenever the serialized shape of any artifact changes incompatibly; consumers
should check it before assuming they can read the other paths, and fall back
to `bundle.json` when it is unrecognized.

## Determinism

Serialization is canonical: the same logical input produces byte-identical
artifacts, regardless of source file enumeration order. Artifact diffs and
sha-keyed caching rely on this, and `test/Artifacts.test.ts` enforces it.

Two mechanisms provide it:

1. **Pinned prover inputs.** Proof content depends on the order theorems and
   traits are fed to the prover, so `artifacts.implications` and
   `artifacts.deduceSpace` sort both by uid. Derived artifacts must be
   produced through these entry points.
2. **Canonical serialization.** Every collection in every artifact is sorted
   (entities by uid, traits by space then property) and object keys are
   emitted in schema order.
