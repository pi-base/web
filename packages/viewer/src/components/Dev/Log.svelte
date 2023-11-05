<script lang="ts">
  import context from '@/context'

  const { spaces, properties, theorems, traits } = context()

  function log() {
    console.log({
      spaces: $spaces,
      properties: $properties,
      theorems: $theorems,
      traits: $traits,
    })
  }
</script>

<button type="button" class="btn btn-outline-dark" on:click={log}>
  <slot />
</button>
