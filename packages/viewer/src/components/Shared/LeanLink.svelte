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
  import { Icons } from '@/components/Shared'
  import { defaultStorage } from '@/repositories'

  export let kind: 'property' | 'theorem'
  export let id: number

  let enabled = defaultStorage.getItem('showLeanLinks') !== null
  let loaded = false
  let available = false

  $: folderName = kind === 'property' ? `P${id}` : `T${id}`
  $: file = kind === 'property' ? 'Defs.lean' : 'Theorem.lean'
  $: basePath =
    kind === 'property' ? 'PibaseLean/Properties' : 'PibaseLean/Theorems'
  $: href = `https://github.com/${repo}/blob/master/${basePath}/${folderName}/${file}`

  onMount(async () => {
    if (!enabled) {
      loaded = true
      return
    }
    const ids = await directories[kind]
    available = ids.has(folderName)
    loaded = true
  })
</script>

{#if enabled && loaded}
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
