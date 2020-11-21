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
