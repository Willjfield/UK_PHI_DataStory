<template>
  <div class="gradient"
    :style="{ background: `linear-gradient(90deg, ${indicator['fill-color'][4]} 0%, ${indicator['fill-color'][indicator['fill-color'].length-1]} 100%)` }" />
  <div v-if="indicator.label" class="gradient-text">
    <span style="text-align: left;">1</span>
    <span style="text-align: right; float:right;">{{ indicator['fill-color'][indicator['fill-color'].length-2] }}</span>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  indicator: any
}>()
</script>
