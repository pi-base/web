// TODO: minimize usage of this flag, remove once implementation is cut over
export const isLegacy = Cypress.config().baseUrl?.includes(
  'topology.pi-base.org',
)
