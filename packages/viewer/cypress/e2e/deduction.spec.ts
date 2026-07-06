import { deduce, setup } from '../support'

beforeEach(setup)

it('finds proofs for the first space', () => {
  cy.visit('/spaces/S000001')

  cy.contains('Functionally Hausdorff')
})

it('shows derived proofs', () => {
  cy.visit('/spaces/S000004/properties/P000031')
  // Wait for the client-side prover before asserting derived content.
  deduce()

  // Math-free prefix of the space name (the name embeds KaTeX), so this holds
  // against both the fixture and live data.
  cy.contains('Indiscrete topology on')
  cy.contains('Metacompact')

  cy.contains('Automatically deduced from the following', { timeout: 20000 })
})

it('derives proofs of converses', () => {
  cy.visit('/theorems/T000031') // characterization of manifold

  cy.contains(/The converse.*follows from these theorems/)

  cy.get('.table').contains(/T\d+/) // shows at least one theorem ID
})

export {}
