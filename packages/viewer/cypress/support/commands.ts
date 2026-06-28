// Whether the current run uses the deterministic fixture or the deployment's
// real data bundle (see cypress.config.ts / CYPRESS_ENV).
const live = Cypress.env('mode') === 'live'

export function setup() {
  cy.clearAllLocalStorage()
  // In fixture mode, serve deterministic data so content assertions are stable.
  // In live mode, let the app fetch its real bundle so we exercise the actual
  // deployment end-to-end (and verify cross-site consistency).
  if (!live) {
    cy.intercept({ path: /main.json/ }, { fixture: 'main.min.json' })
  }
}

export function deduce() {
  cy.get('.progress').should('exist')
  cy.get('.progress', { timeout: 10000 }).should('not.exist')
}
