export function setup() {
  cy.clearAllLocalStorage()
  cy.intercept({ path: /main.json/ }, { fixture: 'main.min.json' })
}

export function deduce() {
  cy.get('.progress').should('exist')
  cy.get('.progress').should('not.exist')
}
