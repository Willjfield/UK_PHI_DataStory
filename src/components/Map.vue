<template>
  <div id="comparison-container">
    <div class="pa-2 ma-4 indicator-selectors" :class="{ collapsed: _collapsed }">
      <v-select v-model="selectedLeftIndicator" class="indicator-selector" density="compact" hide-details
        item-title="label" :items="indicators" label="Left Map Indicator" return-object width="40%"
        @update:model-value="(val) => changeIndicator(val, leftMap, leftStyle)" />
      <v-select v-model="selectedRightIndicator" class="indicator-selector" density="compact" hide-details
        item-title="label" :items="indicators" label="Right Map Indicator" return-object width="40%"
        @update:model-value="(val) => changeIndicator(val, rightMap, rightStyle)" />
    </div>
    <div ref="mapContainerLeft" class="map-container" :class="{ collapsed: _collapsed }">
      <v-card class="ma-4 legend" :style="{ left: 0, 'max-width': (compareWidth * .25) + 'px' }"
       :title="selectedLeftIndicator.label" >
       <template #text>
        <v-expansion-panels v-show="selectedLeftIndicator?.description" static>
          <v-expansion-panel class="more-info-expand" :text="selectedLeftIndicator?.description" title="Details" />
        </v-expansion-panels>
        <div v-if="selectedLeftIndicator.type === 'rank'">
          <LegendRank :indicator="selectedLeftIndicator"></LegendRank>
        </div>
        <div v-else-if="selectedLeftIndicator.type === 'pct'">
          <LegendPct :indicator="selectedLeftIndicator"></LegendPct>
        </div>
        <div v-else-if="selectedLeftIndicator.type === 'dec'">
          <LegendDec :indicator="selectedLeftIndicator" />
        </div>
        <div v-else> <LegendRank :indicator="selectedLeftIndicator"></LegendRank></div>
      </template>
       </v-card>
    </div>
    <div ref="mapContainerRight" class="map-container" :class="{ collapsed: _collapsed }" />
    <v-card class="ma-4 legend legend-right" :class="{ collapsed: _collapsed }" :title="selectedRightIndicator.label"
      :style="{
        'max-width': ((_window.innerWidth - compareWidth) * .25) + 'px'
      }">
      <template #text>
        <v-expansion-panels v-show="selectedRightIndicator?.description" static>
          <v-expansion-panel class="more-info-expand" :text="selectedRightIndicator?.description" title="Details" />
        </v-expansion-panels>
        <div v-if="selectedRightIndicator.type === 'rank'">
          <LegendRank :indicator="selectedRightIndicator"></LegendRank>
        </div>
        <div v-else-if="selectedRightIndicator.type === 'pct'">
          <LegendPct :indicator="selectedRightIndicator"></LegendPct>
        </div>
        <div v-else-if="selectedRightIndicator.type === 'dec'">
          <LegendDec :indicator="selectedRightIndicator" />
        </div>
        <div v-else> <LegendRank :indicator="selectedRightIndicator"></LegendRank></div>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as mapStyle from '@/assets/basic.json'
import { indicators } from '@/assets/indicators.json'
import Compare from '@/assets/maplibre-gl-compare.js'
import '@/assets/maplibre-gl-compare.css'
import LegendPct from './LegendPct.vue'
import LegendDec from './LegendDec.vue'
const mapContainerLeft = ref<HTMLElement>()
let leftMap: maplibregl.Map | null = null

const mapContainerRight = ref<HTMLElement>()
let rightMap: maplibregl.Map | null = null

const comparisonContainer = '#comparison-container'

const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

// Define props with default values if needed
const props = defineProps<{
  _center: [number, number]
  _zoom: number
  _collapsed: boolean
  _type: string
}>()

const choroplethIDs: Set<string> = new Set(['oa-england', 'oa-scotland', 'oa-wales', 'oa-northern-ireland'])

const defaultLeftIndicatorField = 'uk_imd2019_SOA_decile'
const leftStyle = JSON.parse(JSON.stringify(mapStyle))

const defaultRightIndicatorField = 'ahah_v4_ah4ahah_pct'
const rightStyle = JSON.parse(JSON.stringify(mapStyle))

const selectedLeftIndicatorField = ref(defaultLeftIndicatorField)
const selectedRightIndicatorField = ref(defaultRightIndicatorField)

const selectedLeftIndicator = ref(indicators.find(i => i.field === selectedLeftIndicatorField.value))
const selectedRightIndicator = ref(indicators.find(i => i.field === selectedRightIndicatorField.value))

const _window = ref(window)
function changeIndicator(_indicator: any, map: maplibregl.Map | null, style: any) {
  style.layers = style.layers.map(l => {
    if (choroplethIDs.has(l.id)) {
      l.paint['fill-color'] = _indicator['fill-color']
    }
    return l
  })

  map?.setStyle(style)
}

changeIndicator(selectedLeftIndicator.value, null, leftStyle)
changeIndicator(selectedRightIndicator.value, null, rightStyle)

let _compare: Compare

let compareWidth = ref(0)
// Watch for changes in props._type and execute function based on value
watch(() => props._type, (newType, oldType) => {
  console.log(`Type changed from ${oldType} to ${newType}`)
  if (_compare) _compare.switchType(newType)
})

onMounted(() => {
  // Ensure the container is properly initialized
  if (mapContainerLeft.value) {
    leftMap = new maplibregl.Map({
      container: mapContainerLeft.value, // use ref instead of string id
      style: leftStyle,
      center: props._center,
      zoom: props._zoom,
    })

    leftMap.on('mousemove', e => {
      const features = leftMap.queryRenderedFeatures(e.point, { layers: ['oa-england', 'oa-wales', 'oa-scotland', 'oa-northern-ireland'] })
      if (features.length === 0) return
      console.log('LEFT MAP')
      console.log(features[0]?.properties)
    })
  }

  if (mapContainerRight.value) {
    rightMap = new maplibregl.Map({
      container: mapContainerRight.value, // use ref instead of string id
      style: rightStyle,
      center: props._center,
      zoom: props._zoom,
    })

    rightMap.on('mousemove', e => {
      const features = rightMap.queryRenderedFeatures(e.point, { layers: ['oa-england', 'oa-wales', 'oa-scotland', 'oa-northern-ireland'] })
      if (features.length === 0) return
    })
  }

  _compare = new Compare(leftMap, rightMap, comparisonContainer, { type: props._type })

  _compare.on('slideend', e => {
    compareWidth.value = e.currentPosition
  })
})

onUnmounted(() => {
  if (leftMap) {
    leftMap.remove()
  }
  if (rightMap) {
    rightMap.remove()
  }
})
</script>
<style>
.v-card-title,
.v-card-subtitle {
  white-space: normal !important;
}

.v-card-title {
  line-height: 1.1em !important;
  font-size: 1rem !important;
}

.v-card-subtitle {
  line-height: 1em !important;
}

.legend {
  position: absolute !important;
  z-index: 2 !important;
  bottom: 0;
  min-width: 200px;
}

.legend.legend-right {
  right: 33%;
}

.legend.legend-right.collapsed {
  right: 0%;
  transition: right 0.3s ease-in-out;
}

.legend>.v-card-item {
  padding-bottom: 1px !important;
}

.more-info-expand {
  margin-bottom: 4px;
}

.more-info-expand .v-expansion-panel-title {
  padding: 4px 18px !important;
  font-weight: bold;
  border-bottom: 1px solid lightgray;
  min-height: 0;

}

.step {
  width: 20px;
  min-height: 100px;
  height: 100%;
}

.gradient {
  height: 20px;
  width: 100%;
  background: linear-gradient(0deg, #000 0%, #fff 100%);
}

.gradient-text span {
  display: inline-block;
  width: 33%;
}

.step-color {
  width: 12px;
  height: 12px;
}

.step-value {
  font-size: 12px;
  line-height: 12px;
}

.step-wrapper {
  display: inline-block;
  padding: 0 2px;
}

.map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  cursor: crosshair !important;
  width: 68%;
  transition: width .3s ease-in-out;
  border-left: 1px solid black;
}

.map-container.collapsed {
  width: calc(100% + 8px);
}

.maplibregl-canvas-container.maplibregl-interactive {
  cursor: crosshair !important;
}

.indicator-selectors {
  position: absolute;
  top: 0;
  left: 33.33%;
  transform: translateX(-50%);
  width: auto;
  min-width: 40%;
  background: transparent;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 8px;
  gap: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: none;
  transition: left 0.3s ease-in-out;

}

.indicator-selectors.collapsed {
  /* width: calc(100% + 8px); */
  left: 50%;
  transition: left 0.3s ease-in-out;
  /* transform: translateX(0); */
}

.indicator-selector {
  width: 100%;
  pointer-events: auto;
  background-color: #fff8;
}
</style>
