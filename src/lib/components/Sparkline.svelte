<script lang="ts">
  export let data: number[] = [];
  export let width = 80;
  export let height = 24;
  export let stroke: string = 'currentColor';

  $: points = (() => {
    if (data.length === 0) return '';
    if (data.length === 1) return `0,${height / 2} ${width},${height / 2}`;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    return data
      .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`)
      .join(' ');
  })();

  $: lastX = data.length > 1 ? width : width / 2;
  $: lastY = (() => {
    if (data.length === 0) return height / 2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
  })();
</script>

{#if data.length > 0}
  <svg {width} {height} viewBox="0 0 {width} {height}" class="spark">
    <polyline points={points} fill="none" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx={lastX} cy={lastY} r="2.2" fill={stroke} />
  </svg>
{/if}

<style>
  .spark { display: inline-block; vertical-align: middle; }
</style>
