<template>
  <div
    v-if="indicator.label && indicator['fill-color'][0] === 'step'"
    class="step-wrapper"
  >
    <div
      v-for="(c,i) in indicator['fill-color']"
      v-show="i <= 10 && typeof c === 'string' && c.includes('hsl')"
      :key="c"
      class="step-color"
      :style="{ background: c }"
    />

  </div>
  <div
    v-if="indicator.label && indicator['fill-color'][0] === 'step'"
    class="step-wrapper"
  >
    <div
      v-for="c in indicator['fill-color']"
      v-show="typeof c === 'number' && c <= 5"
      :key="c"
      class="step-value"
    >- {{ c }} Decile <span v-show="c===1">(Most Deprived)</span></div>
  </div>
  <div
    v-if="indicator.label && indicator['fill-color'][0] === 'step'"
    class="step-wrapper"
  >
    <div
      v-for="(c,i) in indicator['fill-color']"
      v-show="i > 10 && typeof c === 'string' && c.includes('hsl')"
      :key="c"
      class="step-color"
      :style="{ background: c }"
    />

  </div>
  <div
    v-if="indicator.label && indicator['fill-color'][0] === 'step'"
    class="step-wrapper"
  >
    <div
      v-for="c in indicator['fill-color']"
      v-show="typeof c === 'number' && c > 5"
      :key="c"
      class="step-value"
    >- {{ c }} Decile</div>
    <div class="step-value">- 10 Decile (Least Deprived)</div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  indicator: any
}>()
</script>
