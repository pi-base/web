<script context="module" lang="ts">
  const repo = 'felixpernegger/pibase-lean'

  const cache: Record<string, Promise<Set<string>>> = {}

  function getDirectory(kind: 'property' | 'theorem'): Promise<Set<string>> {
    const path =
      kind === 'property' ? 'PiBaseLean/Properties' : 'PiBaseLean/Theorems'
    if (!cache[kind]) {
      cache[kind] = fetchDirectory(path)
    }
    return cache[kind]
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
  import { Icons } from '@/components/Shared'
  import { showLeanLinks } from '@/stores/settings'

  export let kind: 'property' | 'theorem'
  export let id: number

  let loaded = false
  let available = false

  $: folderName = kind === 'property' ? `P${id}` : `T${id}`
  $: file = kind === 'property' ? 'Defs.lean' : 'Theorem.lean'
  $: basePath =
    kind === 'property' ? 'PiBaseLean/Properties' : 'PiBaseLean/Theorems'
  $: href = `https://github.com/${repo}/blob/master/${basePath}/${folderName}/${file}`

  $: if ($showLeanLinks && !loaded) {
    getDirectory(kind).then(ids => {
      available = ids.has(folderName)
      loaded = true
    })
  }
</script>

{#if $showLeanLinks && loaded}
  {#if available}
    <div>
      <a {href} target="_blank" rel="noopener noreferrer">
        <Icons.Lean />
      </a>
    </div>
  {/if}
{/if}

<style>
  div {
    display: inline-block;
    border: 1px solid white;
    padding: 2px;
  }
  div:hover {
    background: #f6fafe;
    border: 1px solid #e0edfb;
    border-radius: 5px;
  }
  a {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
