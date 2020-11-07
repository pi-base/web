<script lang="ts">
  import { Related } from '../Traits'
  import type { Property } from '../../models'

  export let property: Property
</script>

<Related
  label="Space"
  related={(traits) => traits.forProperty(property)}
  linkRecord={(uid) => `/spaces/${uid}`}
  linkTrait={(uid) => `/spaces/${uid}/properties/${property.uid}`} />
