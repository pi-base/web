<script lang="ts">
  import context from '../context'

  const { deduction, spaces } = context()
</script>

{#if $deduction.checked < $deduction.total - 1}
  <section class="notifications">
    <item>
      <pre>{JSON.stringify({ deduction: $deduction, spaces: $spaces.all.length }, null, 2)}</pre>
    </item>
  </section>
{/if}
