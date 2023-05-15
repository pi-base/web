import { isLegacy } from '../constants'

const search = '/spaces'

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

  // This is important to preserve backwards-compatible URLs that have been
  // published to MathExchange &c.
  it('loads from query params', () => {
    const query = '~metrizable + compact'
    cy.visit(`${search}?q=${query.replace('+', '%2B')}&text=square`)

    cy.contains('Alexandroff square')
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
