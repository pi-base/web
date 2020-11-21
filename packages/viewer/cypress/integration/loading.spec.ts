describe('Loading', () => {
  describe('with a working remote', () => {
    beforeEach(() => {
      cy.server()
      cy.route(
        'https://pi-base-bundles.s3.us-east-2.amazonaws.com/refs/heads/master.json',
        'fixture:main.min.json',
      )
    })
  })

  it('loads', () => {
    cy.visit('/theorems/T000002')

    cy.title().should(
      'eq',
      'Countably compact ⇒ Weakly Countably Compact | π-Base',
    )
    cy.contains('Countably compact ⇒ Weakly Countably Compact')
  })
})
