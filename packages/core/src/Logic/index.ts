export { default as ImplicationIndex } from './ImplicationIndex'
export { Derivations } from './Derivations'
export { Contradiction, Proof } from './Prover'

import { Formula, negate } from '../Formula'
import ImplicationIndex from './ImplicationIndex'
import Prover, { Contradiction, Proof, Result } from './Prover'
import { Id } from './Types'

// Given a collection of implications and a collection of traits for an object,
// find either the collection of derivable traits, or a contradiction
export function deduceTraits<TheoremId = Id, PropertyId = Id>(
  implications: ImplicationIndex<TheoremId, PropertyId>,
  traits: Map<PropertyId, boolean>,
): Result<TheoremId, PropertyId> {
  return new Prover(implications, traits).run()
}

// Given a collection of implications and a candidate formula,
// return a proof of why the formula is unsatisfiable, if possible
//
// The current proof strategy is to force the formula and then look for a
// a contradiction. Note that this does not find all possible proofs - e.g. when
// the formula is a disjunction, `force(a | b)` does not actually force anything.
export function disproveFormula<TheoremId = Id, PropertyId = Id>(
  implications: ImplicationIndex<TheoremId, PropertyId>,
  formula: Formula<PropertyId>,
): TheoremId[] | 'tautology' | undefined {
  const prover = new Prover<TheoremId | 'given', PropertyId>(implications)

  const contradiction = prover.force('given', formula)
  if (contradiction) {
    return formatProof(contradiction)
  }

  const result = prover.run()
  if (result.kind === 'contradiction') {
    return formatProof(result.contradiction)
  }
}

// Given a collection of implications and a candidate implication,
// attempt to derive a proof of the candidate
export function proveTheorem<TheoremId = Id, PropertyId = Id>(
  theorems: ImplicationIndex<TheoremId, PropertyId>,
  when: Formula<PropertyId>,
  then: Formula<PropertyId>,
): TheoremId[] | 'tautology' | undefined {
  // We don't want to `disproveFormula(when + ~then)` given the current
  // limitations of `disproveFormula` above. Instead we:
  //
  // * force `then`
  // * run deductions
  // * force `~when`
  // * run deductions
  //
  // Note that this still has edges, e.g.
  // * `A | B => C` doesn't circle back to assert `then`
  // * `A | B => C + D` can't get started at all
  let contradiction: Contradiction<TheoremId | 'given', PropertyId> | undefined
  let result: Result<TheoremId | 'given', PropertyId>

  const prover = new Prover<TheoremId | 'given', PropertyId>(theorems)
  contradiction = prover.force('given', when)
  if (contradiction) {
    return formatProof(contradiction)
  }

  result = prover.run()
  if (result.kind === 'contradiction') {
    return formatProof(result.contradiction)
  }

  contradiction = prover.force('given', negate(then))
  if (contradiction) {
    return formatProof(contradiction)
  }

  result = prover.run()
  if (result.kind === 'contradiction') {
    return formatProof(result.contradiction)
  }
}

function formatProof<TheoremId, PropertyId>(
  proof: Proof<TheoremId | 'given', PropertyId>,
): TheoremId[] | 'tautology' {
  const filtered: TheoremId[] = []
  proof.theorems.forEach((id: TheoremId | 'given') => {
    if (id !== 'given') {
      filtered.push(id)
    }
  })
  return filtered.length > 0 ? filtered : 'tautology'
}
