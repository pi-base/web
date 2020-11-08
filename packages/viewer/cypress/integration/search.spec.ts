describe('Searching', () => {
  it('searches', () => {
    cy.visit('/spaces')

    cy.get('input[name="text"]').type('plank')
    cy.get('input[name="formula"]').type('metacom')

    cy.url()
      .should('include', 'text=plank')
      .should('include', 'formula=metacom')
  })
})
