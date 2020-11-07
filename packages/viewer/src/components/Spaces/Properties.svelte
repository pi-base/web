<script lang="ts">
  import { Related } from '../Traits'
  import type { Space } from '../../models'

  export let space: Space
</script>

<Related
  label="Property"
  related={(traits) => traits.forSpace(space)}
  linkRecord={(uid) => `/properties/${uid}`}
  linkTrait={(uid) => `/spaces/${space.uid}/properties/${uid}`} />
