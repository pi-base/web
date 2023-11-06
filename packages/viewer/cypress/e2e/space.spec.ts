import { deduce, setup } from '../support'

beforeEach(setup)

it('links to properties', () => {
  cy.visit('spaces/S000004/properties')
  deduce()

  cy.contains('Semiregular').click()

  cy.location('pathname').should('eq', '/properties/P000010')
})

it('links to traits', () => {
  cy.visit('spaces/S000004/properties')
  deduce()

  cy.contains('Semiregular').closest('tr').find('.bi-check').click()

  cy.location('pathname').should('eq', '/spaces/S000004/properties/P000010')
})

it('filters traits', () => {
  cy.visit('spaces/S000004/properties')
  deduce()

  cy.get('[placeholder=Filter]').type('comp')

  cy.get('.related-traits > tbody > tr')
    .first()
    .should('have.text', '16 Compact   ')
})
