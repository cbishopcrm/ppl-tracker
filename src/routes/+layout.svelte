<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import Toast from '$lib/components/Toast.svelte';

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  });
</script>

<slot />
<Toast />
