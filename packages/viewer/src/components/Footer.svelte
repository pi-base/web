<script lang="ts">
  import Sync from './Dev/Sync.svelte'
</script>

<!-- Footer -->
<footer class="text-center bg-light text-muted">
  <div class="pt-4">
    Data © {new Date().getFullYear()} Steven Clontz and James Dabbs (<a
      class="text-dark"
      href="https://github.com/pi-base/data/blob/main/LICENSE.md">CC-BY</a
    >) | Software © {new Date().getFullYear()} James Dabbs (<a
      class="text-dark"
      href="https://github.com/pi-base/web/blob/main/LICENSE.md">MIT License</a
    >) |
    <a class="text-dark" href="https://github.com/pi-base">GitHub</a>
  </div>
  <div class="p-2">
    Data last synchonized: <Sync />
  </div>
</footer>
