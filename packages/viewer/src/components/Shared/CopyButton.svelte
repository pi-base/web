<script lang="ts">
  export let text = ''
  let confirmIcon = false
  const click = (_: Event) => {
    navigator.clipboard.writeText(text)
    confirmIcon = true
    setTimeout(() => (confirmIcon = false), 3000)
  }
</script>

<button
  type="button"
  class="btn btn-outline-secondary btn-sm"
  on:click={click}
  title={text}
>
  {#if confirmIcon}Copied! ✓{:else}<slot />{/if}
</button>
