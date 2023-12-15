<script lang="ts">
  import type { And, Or } from '@pi-base/core'

  import type { Property } from '@/models'

  import Formula from '../Formula.svelte'

  export let value: And<Property> | Or<Property>
  export let link = true

  $: connector = value.kind === 'and' ? '∧' : '∨'
</script>

({#each value.subs as f, i}<Formula value={f} {link} />{i ===
  value.subs.length - 1
    ? ''
    : ` ${connector} `}{/each})
