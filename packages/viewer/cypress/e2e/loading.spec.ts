import { isLegacy, setup } from '../support'

beforeEach(setup)

describe('Loading', () => {
  it('loads', () => {
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
