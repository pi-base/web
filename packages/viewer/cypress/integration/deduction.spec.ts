beforeEach(() => {
  cy.server()
  cy.route(
    'https://pi-base-bundles.s3.us-east-2.amazonaws.com/refs/heads/master.json',
    'fixture:main.min.json',
  )
})

it('shows derived proofs', () => {
  cy.visit('/spaces/S000154/properties/P000001')

  cy.contains('Fort Space on the Real Numbers')
  cy.contains('T1')
  cy.contains('119').click()

  cy.url().should('match', new RegExp('/theorems/T000119$'))
})

it('derives multi-step proofs', () => {
  cy.visit('/spaces/S000004/properties/P000031')

  cy.contains('Indiscrete Topology on a Two-Point Set')
  cy.contains('Metacompact')

  cy.contains('Finite')
  cy.contains('198') // Finite => Compact
  cy.contains('14') // Compact => Paracompact
  cy.contains('13') // Paracompact => Metacompact
})
