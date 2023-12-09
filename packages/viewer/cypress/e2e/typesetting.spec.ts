import { deduce, setup } from '../support'

beforeEach(setup)

it('renders internal links', () => {
  cy.visit('dev/preview')
  deduce()

  cy.get('[data-testid=input]').type(
    // {{} is Cypress escaping for {. See https://docs.cypress.io/api/commands/type#Arguments
    `{{}S000001} is {{}P000001} as noted in {{}S000001|P000001}`,
  )

  cy.get('[data-testid=output]').contains(
    'Discrete topology on a two-point set is $T_0$ as noted in Discrete topology on a two-point set is $T_0$',
  )
})
