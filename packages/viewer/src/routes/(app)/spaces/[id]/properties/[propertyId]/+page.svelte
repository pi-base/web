<script lang="ts">
  import { page } from '$app/stores'
  import { Show } from '@/components/Traits'
</script>

<Show spaceId={$page.params.id} propertyId={$page.params.propertyId} />
