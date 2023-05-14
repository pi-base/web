import { isLegacy } from '../constants'

describe('Loading', () => {
  it('loads', () => {
    cy.intercept({ hostname: /pi-base-bundles/ }, { fixture: 'main.min.json' })

    cy.visit('/theorems/T000002')

    if (!isLegacy) {
      cy.title().should(
        'eq',
        'Countably compact ⇒ Weakly Countably Compact | π-Base',
      )
    }
    cy.contains('Countably compact ⇒ Weakly Countably Compact')
  })
})

export {}
