import { deduce, setup } from '../support'

beforeEach(setup)

it('renders internal links', () => {
  cy.visit('dev/preview')
  deduce()

  cy.get('[data-testid=input]').type(
    // {{} is Cypress escaping for {. See https://docs.cypress.io/api/commands/type#Arguments
    `{{}S000001} is {{}P000001} as noted in {{}S000001|P000001}`,
  )

  // The references should resolve to names and any embedded math should be
  // typeset by KaTeX — not left as literal `{...}` or `$...$`. We assert the
  // behavior rather than an exact HTML snapshot, so it holds against live data
  // (whose names embed math) and across KaTeX versions.
  cy.get('[data-testid=output]')
    .should('not.contain', '{S000001}')
    .and('not.contain', '$T_0$')
    .and('contain', 'Discrete topology on')
    .and('contain', 'as noted in')
  cy.get('[data-testid=output] .katex').should('exist')
})
