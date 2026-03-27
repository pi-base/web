<script context="module" lang="ts">
  const repo = 'felixpernegger/pibase-lean'

  const directories: Record<string, Promise<Set<string>>> = {
    property: fetchDirectory('PibaseLean/Properties'),
    theorem: fetchDirectory('PibaseLean/Theorems'),
  }

  async function fetchDirectory(path: string): Promise<Set<string>> {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/contents/${path}`,
      )
      if (!res.ok) return new Set()
      const entries: { name: string }[] = await res.json()
      return new Set(entries.map(e => e.name))
    } catch {
      return new Set()
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  export let kind: 'property' | 'theorem'
  export let id: number

  let loaded = false
  let available = false

  $: folderName = kind === 'property' ? `P${id}` : `T${id}`
  $: file = kind === 'property' ? 'Defs.lean' : 'Theorem.lean'
  $: basePath =
    kind === 'property' ? 'PibaseLean/Properties' : 'PibaseLean/Theorems'
  $: href = `https://github.com/${repo}/blob/master/${basePath}/${folderName}/${file}`

  onMount(async () => {
    const ids = await directories[kind]
    available = ids.has(folderName)
    loaded = true
  })
</script>

{#if loaded}
  <p>
    {#if available}
      <a {href} target="_blank" rel="noopener noreferrer">
        Formalisation available.
      </a>
    {:else}
      No formalisation available.
    {/if}
  </p>
{/if}
