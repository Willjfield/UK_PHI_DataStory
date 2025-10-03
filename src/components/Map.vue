<template>
  <div id="comparison-container">
    <div class="pa-2 ma-4 indicator-selectors" :class="{collapsed:_collapsed}">
      <v-select
        v-model="selectedLeftIndicator"
        class="indicator-selector"
        density="compact"
        hide-details
        item-title="label"
        return-object
        :items="indicators"
        label="Left Map Indicator"
        width="40%"
        @update:model-value="(val) => changeIndicator(val,leftMap,leftStyle)"
      />
      <v-select
        v-model="selectedRightIndicator"
        class="indicator-selector"
        density="compact"
        hide-details
        item-title="label"
        return-object
        :items="indicators"
        label="Right Map Indicator"
        width="40%"
        @update:model-value="(val) => changeIndicator(val, rightMap,rightStyle)"
      />
    </div>
    <v-card class="legend" :title="selectedLeftIndicatorLabel.label" />
    <div ref="mapContainerLeft" class="map-container" :class="{collapsed:_collapsed}" />
    <div ref="mapContainerRight" class="map-container" :class="{collapsed:_collapsed}" />
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

  const defaultLeftIndicatorLabel = 'uk_imd2019_SOA_decile'
  const leftStyle = JSON.parse(JSON.stringify(mapStyle))

  const defaultRightIndicatorLabel = 'ahah_v4_ah4ahah_pct'
  const rightStyle = JSON.parse(JSON.stringify(mapStyle))

  const selectedLeftIndicatorLabel = ref(defaultLeftIndicatorLabel)
  const selectedRightIndicatorLabel = ref(defaultRightIndicatorLabel)

  const selectedLeftIndicator = ref(indicators.find(i => i.field === selectedLeftIndicatorLabel.value))
  const selectedRightIndicator = ref(indicators.find(i => i.field === selectedRightIndicatorLabel.value))

  function changeIndicator (_indicator: any, map: maplibregl.Map | null, style: any) {
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
.map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  cursor: crosshair !important;
  width: 68%;
  transition: width .3s ease-in-out;
  border-left: 1px solid black;
}

.map-container.collapsed{
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
