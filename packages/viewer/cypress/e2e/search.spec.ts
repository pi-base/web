import { deduce, isLegacy, setup } from '../support'

beforeEach(setup)

const search = '/spaces'

describe('with a working remote', () => {
  it('searches by text and formula', () => {
    cy.visit(search)
    deduce()

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
    deduce()

    cy.get('.status .progress').should('not.exist')

    cy.contains('Alexandroff square')
  })

  it('indicates when search is impossible', () => {
    cy.visit(search)
    deduce()

    cy.get('input[name="q"]').type('discrete + ~metrizable', {
      delay: 0,
      force: true,
    })

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
    deduce()

    cy.contains('compact + connected + t_2 + ~metrizable').click()

    cy.contains('Closed long ray')

    cy.get('.suggestions').should('not.exist')
  })

  it('can follow formula links from the home page', () => {
    cy.visit('/')
    deduce()

    cy.contains('non-metric continua').click()

    cy.contains('Lexicographic unit square')
  })

  it('can follow text links from the home page', () => {
    cy.visit('/')
    deduce()

    cy.contains('compactifications').click()

    cy.contains('One Point Compactification')
  })
})
