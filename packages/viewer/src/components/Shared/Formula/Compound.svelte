<script lang="ts">
  import type { And, Or } from '@pi-base/core'

  import type { Property } from '@/models'

  import Formula from '../Formula.svelte'

  export let value: And<Property> | Or<Property>
  export let link = true
  export let grouped = true
  export let emphasizedProperties: Set<Property> = new Set()

  $: connector = value.kind === 'and' ? '∧' : '∨'
</script>

{#if grouped}({/if}{#each value.subs as f, i}<Formula
    value={f}
    {link}
    subformula
    {emphasizedProperties}
  />{i === value.subs.length - 1
    ? ''
    : ` ${connector} `}{/each}{#if grouped}){/if}
