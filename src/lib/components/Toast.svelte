<script lang="ts">
  import { toast } from './toast';
</script>

<div class="toast" class:show={!!$toast}>{$toast}</div>
