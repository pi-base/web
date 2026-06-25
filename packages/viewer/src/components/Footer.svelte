<script lang="ts">
  import { categoryConfig } from '@/constants'
  import markdownit from 'markdown-it'
  const md = markdownit()
  import Sync from './Dev/Sync.svelte'
</script>

<!-- Footer -->
<footer class="text-center bg-light text-muted">
  <div class="pt-4">
    {@html md.renderInline(
      categoryConfig.footer(new Date().getFullYear().toString()),
    )}
  </div>
  <div class="p-2">
    Data last synchonized: <Sync />
  </div>
</footer>

<style>
  :global(footer a) {
    color: #343a40;
  }
</style>
