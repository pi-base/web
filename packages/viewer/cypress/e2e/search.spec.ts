import { isLegacy } from '../constants'

const { search } = isLegacy ? { search: '/spaces' } : { search: '/explore' }

describe('with a working remote', () => {
  beforeEach(() => {
    cy.intercept({ hostname: /pi-base-bundles/ }, { fixture: 'main.min.json' })
  })

  it('searches by text and formula', () => {
    cy.visit(search)

    cy.get('input[name="text"]').type('plank')
    cy.get('input[name="q"]').type('metacom')

    cy.url().should('include', 'text=plank').should('include', 'q=metacom')

    cy.contains('Dieudonné plank')
  })

  it('indicates when search is impossible', () => {
    cy.visit(search)

    cy.get('input[name="q"]').type('discrete + ~metrizable')

    cy.contains(
      isLegacy
        ? /is impossible by/
        : /Discrete.*∧.*¬.*Metrizable.*\).*is impossible by/,
    )
    cy.contains('85').click()
    cy.contains('Discrete ⇒ Completely metrizable')
  })

  it('can follow an example search', () => {
    cy.visit(search)

    cy.contains('compact + connected + t_2 + ~metrizable').click()

    cy.contains('Closed long ray')

    cy.get('.suggestions').should('not.exist')
  })

  it('can follow formula links from the home page', () => {
    cy.visit('/')

    cy.contains('non-metric continua').click()

    cy.contains('Lexicographic unit square')
  })

  it('can follow text links from the home page', () => {
    cy.visit('/')

    cy.contains('compactifications').click()

    cy.contains('One Point Compactification')
  })
})

export {}
