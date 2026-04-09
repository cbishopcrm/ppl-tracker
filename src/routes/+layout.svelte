<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import Toast from '$lib/components/Toast.svelte';
  import { pushToast } from '$lib/components/toast';

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            if (!newSW) return;
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                pushToast('New version available — reloading…', 1500);
                setTimeout(() => location.reload(), 1500);
              }
            });
          });
        })
        .catch(() => {});

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    }
  });
</script>

<slot />
<Toast />
