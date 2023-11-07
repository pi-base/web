import { deduce, setup } from '../support'

beforeEach(setup)

function clickTraitFor(name: string) {
  cy.get('.related-traits')
    .contains(name)
    .closest('tr')
    .find('.bi-check')
    .click()
}

it('links to properties', () => {
  cy.visit('spaces/S000004/properties')
  deduce()

  cy.contains('Semiregular').click()

  cy.location('pathname').should('eq', '/properties/P000010')
})

it('links to traits', () => {
  cy.visit('spaces/S000004/properties')
  deduce()

  clickTraitFor('Semiregular')

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

it('displays trait descriptions', () => {
  cy.visit('spaces/S000001')

  clickTraitFor('Discrete')

  cy.contains('By definition of discrete')
})
