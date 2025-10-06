<template>
  <div class="gradient"
    :style="{ background: `linear-gradient(90deg, ${indicator['fill-color'][4]} 0%, ${indicator['fill-color'][6]} 100%)` }" />
  <div v-if="indicator.label && indicator['fill-color'][0] === 'interpolate'" class="gradient-text">
    <span style="text-align: left;">0%</span>
    <span style="text-align: center;">50%</span>
    <span style="text-align: right;">100%</span>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  indicator: any
}>()
</script>
