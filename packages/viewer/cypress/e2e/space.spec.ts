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

  cy.get('[placeholder=Filter]').type('comp')

  cy.get('.related-traits > tbody > tr > td').first().should('have.text', 'P16')
})

it('displays trait descriptions', () => {
  cy.visit('spaces/S000001')

  clickTraitFor('Discrete')

  cy.contains('All subsets of this space are open by definition.')
})

it('displays references', () => {
  cy.visit('spaces/S000001')

  cy.get('.nav-link').contains('References').click()

  cy.contains('Discrete Space on Wikipedia.')
})
