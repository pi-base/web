import { Property, Space, Theorem, Trait } from './models'


export const property = (property: Property) =>
  `/properties/${property.uid}`

export const space = (space: Space) =>
  `/spaces/${space.uid}`

export const theorem = (theorem: Theorem) =>
  `/theorems/${theorem.uid}`

export const trait = (trait: Trait) => {
  const { space, property } = trait
  return `/spaces/${space}/properties/${property}`
}

const dataRepo = `https://github.com/pi-base/data`
const viewerRepo = `https://github.com/pi-base/viewer`

export function contributeExample() {
  return `${dataRepo}/new/master`
}

export function viewerIssues({
  body,
  title
}: {
  body: string
  title: string
}) {
  return `${viewerRepo}/issues/new?title=${title}&body=${body}`
}

export function contributingGuide() {
  return `${dataRepo}/blob/master/CONTRIBUTING.md`
}

export default {
  contributeExample,
  contributingGuide,
  property,
  space,
  theorem,
  trait,
  viewerIssues
}
