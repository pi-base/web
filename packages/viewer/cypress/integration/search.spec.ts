describe('with a working remote', () => {
  beforeEach(() => {
    cy.server()
    cy.route(
      'https://pi-base-bundles.s3.us-east-2.amazonaws.com/refs/heads/master.json',
      'fixture:main.min.json',
    )
  })

  it('searches by text and formula', () => {
    cy.visit('/spaces')

    cy.get('input[name="text"]').type('plank')
    cy.get('input[name="formula"]').type('metacom')

    cy.url()
      .should('include', 'text=plank')
      .should('include', 'formula=metacom')

    cy.contains('Dieudonné plank')
  })

  it('indicates when search is impossible', () => {
    cy.visit('/spaces')

    cy.get('input[name="formula"]').type('discrete + ~metrizable')

    cy.contains('Discrete ∧¬ Metrizable is impossible by')
    cy.contains('85').click()
    cy.contains('Discrete ⇒ Completely metrizable')
  })

  it('can follow an example search', () => {
    cy.visit('/spaces')

    cy.contains('compact + connected + t_2 + ~metrizable').click()

    cy.contains('Closed long ray')

    // TODO - cy.get('.suggestions').should('not.exist')
  })
})
