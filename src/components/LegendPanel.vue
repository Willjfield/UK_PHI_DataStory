<template>
  <v-card
    class="ma-4 legend"
    :class="{ 'legend-right': side === 'right', collapsed }"
    :style="cardStyle"
  >
    <template #title>
      <v-select
        class="indicator-selector"
        density="compact"
        hide-details
        item-title="label"
        :items="indicators"
        :label="title"
        return-object
        width="100%"
        :model-value="selectedIndicator"
        @update:model-value="(val) => $emit('change', val)"
      />
    </template>
    <template #text>
      <div class="actual-legend-bit">
        <div v-if="selectedIndicator?.type === 'rank'">
          <LegendRank :indicator="selectedIndicator" />
        </div>
        <div v-else-if="selectedIndicator?.type === 'pct'">
          <LegendPct :indicator="selectedIndicator" />
        </div>
        <div v-else-if="selectedIndicator?.type === 'dec'">
          <LegendDec :indicator="selectedIndicator" />
        </div>
        <div v-else>
          <LegendRank :indicator="selectedIndicator" />
        </div>
      </div>
      <v-expansion-panels v-show="selectedIndicator?.description" static>
        <v-expansion-panel
          color="white"
          class="more-info-expand"
          :text="selectedIndicator?.description"
          title="Details"
        />
      </v-expansion-panels>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import LegendDec from './LegendDec.vue'
import LegendPct from './LegendPct.vue'
import LegendRank from './LegendRank.vue'

const props = defineProps<{
  indicators: any[]
  selectedIndicator: any
  side: 'left' | 'right'
  compareWidth: number
  windowWidth: number
  collapsed: boolean
  minWidth?: number
  title: string
}>()

defineEmits<{ (e: 'change', val: any): void }>()

const cardStyle = computed(() => {
  const minWidth = props.minWidth ?? (props.side === 'left' ? 390 : 360)
  if (props.side === 'left') {
    return {
      left: '15px',
      'max-width': `${props.compareWidth * 0.75}px`,
      'min-width': `${minWidth}px`,
    } as Record<string, string>
  }
  return {
    'max-width': `${(props.windowWidth - props.compareWidth) * 0.25}px`,
    'min-width': `${minWidth}px`,
  } as Record<string, string>
})
</script>


