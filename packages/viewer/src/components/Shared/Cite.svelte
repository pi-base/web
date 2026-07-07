<script lang="ts">
  import { categoryConfig } from '@/constants'
  import { page } from '$app/stores'
  import CopyButton from './CopyButton.svelte'
  $: markdown = `[${categoryConfig.citeTitle}](${$page.url})`
</script>

<div class="text-center p-2">
  <small>
    Cite as:
    <span class="text-muted">
      The π-Base Community.
      <cite>{categoryConfig.citeTitle}.</cite>
      Available at: {$page.url}
      (Accessed: {new Date().toISOString().split('T')[0]}).
    </span>
  </small>
</div>
<div class="text-center p-2">
  <small>
    Copy:
    <CopyButton text={markdown}>Markdown Link</CopyButton>
  </small>
</div>
