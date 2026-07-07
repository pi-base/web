import { deduce, setup } from '../support'

beforeEach(setup)

// Marks specs that depend on exact fixture-pinned content and only run in
// fixture mode (see doc/testing.md).
const fixtureIt = Cypress.env('mode') === 'live' ? it.skip : it

function clickTraitFor(name: string) {
  cy.get('.related-traits')
    .contains(name)
    .closest('tr')
    .find('.bi-check')
    .click()
}

it('links to properties', () => {
  cy.visit('spaces/S000004/properties')

  cy.contains('Semiregular').click()

  cy.location('pathname').should('eq', '/properties/P000010')
})

it('links to traits', () => {
  cy.visit('spaces/S000004/properties')

  clickTraitFor('Semiregular')

  cy.location('pathname').should('eq', '/spaces/S000004/properties/P000010')
})

it('filters traits', () => {
  cy.visit('spaces/S000004/properties')

  cy.contains('P16')

  cy.get('[placeholder="Filter by name"]').first().type('compac')

  cy.get('.related-traits > tbody > tr').first().contains('P16')
})

it('displays trait descriptions', () => {
  cy.visit('spaces/S000001')

  clickTraitFor('Discrete')

  cy.contains('All subsets of this space are open by definition.')
})

it('displays references', () => {
  cy.visit('spaces/S000001')

  cy.get('.nav-link').contains('References').click()

  cy.get('ul.references').should('exist')
})

// Navigating between space pages reuses the mounted component, and the traits
// table must recompute for the new space instead of continuing to show the
// previous space's data. See https://github.com/pi-base/web/issues/255.
//
// Fixture-only: relies on S000001's fixture description linking to {S4} (live
// descriptions differ) and on "Indiscrete" being asserted false for S000001
// and true for S000004, so the value icon flips iff the table recomputes.
fixtureIt('recomputes traits when navigating between spaces', () => {
  function indiscreteRow() {
    return cy.get('.related-traits').contains('tr', 'Indiscrete')
  }

  cy.visit('spaces/S000001')

  cy.contains('h1', 'Discrete topology on')
  indiscreteRow().find('.bi-x').should('exist')

  // Client-side navigation via the in-description link (note the unpadded id)
  cy.get('.description').contains('a', 'Indiscrete topology on').click()
  cy.location('pathname').should('eq', '/spaces/S4')
  cy.contains('h1', 'Indiscrete topology on')
  indiscreteRow().find('.bi-check').should('exist')

  cy.go('back')
  cy.location('pathname').should('eq', '/spaces/S000001')
  indiscreteRow().find('.bi-x').should('exist')
})
