<script lang="ts">
  import { Icons, Link, References, Title, Typeset } from '@/components/Shared'
  import { Proof } from '@/components/Traits'
  import type { PageData } from './$types'
  export let data: PageData
  import { contributingUrl } from '@/constants'

  $: title = `S${data.space.id}|P${data.property.id}: ${data.space.name} | ${data.property.name}`
</script>

<h3>Space S{data.space.id} | Property P{data.property.id}</h3>

<Title {title}/>

<h1>
  {#if data.proof}
    <Icons.Robot />
  {:else if data.meta}
    <Icons.User />
  {:else}
    <Icons.Question />
  {/if}
  {#if data.trait}
    <Link.Space space={data.space} />
    is
    {data.trait.value ? '' : 'not'}
    <Link.Property property={data.property} />
  {:else}
    We have insufficient information to determine whether or not
    <Link.Space space={data.space} />
    is
    <Link.Property property={data.property} />
  {/if}
</h1>

{#if data.proof}
  <Proof space={data.space} {...data.proof} />
{:else if data.meta}
  <section class="description">
    <Typeset body={data.meta.description} />
  </section>
  <h3>References</h3>
  <References references={data.meta.refs} />
{:else}
  Please consider <a href={contributingUrl}>contributing</a> a proof or disproof
  of this property.
{/if}
