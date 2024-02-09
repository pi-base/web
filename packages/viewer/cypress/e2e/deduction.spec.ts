import { setup } from '../support'

beforeEach(setup)

it('finds proofs for the first space', () => {
  cy.visit('/spaces/S000001')

  cy.contains('Functionally Hausdorff')
})

it('shows derived proofs', () => {
  cy.visit('/spaces/S000154/properties/P000001')

  cy.contains('Fort Space on the Real Numbers')
  cy.contains('T1')
  cy.contains('119').click()

  cy.location('pathname').should('eq', '/theorems/T000119')
})

it('derives multi-step proofs', () => {
  cy.visit('/spaces/S000004/properties/P000031')

  cy.contains('Indiscrete Topology on a Two-Point Set')
  cy.contains('Metacompact')

  cy.contains('Paracompact')
  cy.contains('251') // Indiscrete => Compact
  cy.contains('14') // Compact => Paracompact
  cy.contains('13') // Paracompact => Metacompact
})

it('derives proofs of converses', () => {
  cy.visit('/theorems/T000099') // (T1 + Normal) => T4

  cy.contains(/The converse.*follows from/)

  cy.contains('335') // T4 => Normal
  cy.contains('98') // T4 => T1
})

export {}
