import { deduce, fixtureOnly, setup } from '../support'

beforeEach(setup)

// Asserts exact KaTeX HTML against the dev typesetting tool — fixture-only, as
// the snapshot is brittle against live data / KaTeX version drift.
fixtureOnly('typesetting', () => {
  it('renders internal links', () => {
    cy.visit('dev/preview')
    deduce()

    cy.get('[data-testid=input]').type(
      // {{} is Cypress escaping for {. See https://docs.cypress.io/api/commands/type#Arguments
      `{{}S000001} is {{}P000001} as noted in {{}S000001|P000001}`,
    )

    cy.get('[data-testid=output]').contains(
      // The T0T_0T0 rendering here is the text representation of the inner html of katex rendered math.
      // We're effectively asserting that it _isn't_ still rendered as $T_0$
      'Discrete topology on a two-point set is T0T_0T0​ as noted in Discrete topology on a two-point set is T0T_0T0​',
    )
  })
})
