<script lang="ts">
  import context from '../../context'
  import { search } from '../../stores'
  import type { Formula, Property } from '../../types'

  export let text: string
  export let formula: Formula<Property> | undefined

  const store = search(context())

  $: results = store.search({ text, formula })
</script>

<pre>{JSON.stringify({ text, formula, results }, null, 2)}</pre>
