<script lang="ts">
  import { Icons, Link, References, Title, Typeset } from '@/components/Shared'
  import { Proof } from '@/components/Traits'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<Title title={`${data.space.name}: ${data.property.name}`} />

<h1>
  {#if data.proof}
    <Icons.Robot />
  {/if}
  <Link.Space space={data.space} />
  is
  {data.trait.value ? '' : 'not'}
  <Link.Property property={data.property} />
</h1>

{#if data.proof}
  <Proof space={data.space} {...data.proof} />
{:else if data.meta}
  <section class="description">
    <Typeset body={data.meta.description} />
  </section>
  <h3>References</h3>
  <References references={data.meta.refs} />
{/if}
