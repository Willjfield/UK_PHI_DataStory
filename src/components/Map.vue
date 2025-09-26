<template>
  <div id="comparison-container">
    <div ref="mapContainerLeft" class="map-container" :class="{collapsed:_collapsed}" />
    <div ref="mapContainerRight" class="map-container" :class="{collapsed:_collapsed}" />
  </div>
</template>

<script lang="ts" setup>
  import maplibregl from 'maplibre-gl'
  import { Protocol } from 'pmtiles'
  import { onMounted, onUnmounted, ref } from 'vue'
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
  }>()

  const choroplethIDs = new Set(['oa-england', 'oa-scotland', 'oa-wales', 'oa-northern-ireland'])

  const defaultLeftIndicator = 'uk_imd2019_SOA_decile'
  const leftStyle = JSON.parse(JSON.stringify(mapStyle))

  leftStyle.layers = leftStyle.layers.map(l => {
    if (choroplethIDs.has(l.id)) {
      console.log(l.id)
      l.paint['fill-color'] = indicators.find(i => i.field === defaultLeftIndicator)['fill-color']
    }
    return l
  })

  const defaultRightIndicator = 'ahah_v4_ah4ahah_pct'
  const rightStyle = JSON.parse(JSON.stringify(mapStyle))
  rightStyle.layers = rightStyle.layers.map(l => {
    if (choroplethIDs.has(l.id)) {
      l.paint['fill-color'] = indicators.find(i => i.field === defaultRightIndicator)['fill-color']
    }
    return l
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
        console.log(features[0]?.properties)
      })
    }

    new Compare(leftMap, rightMap, comparisonContainer, {})
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
  transition: all .3s ease-in-out;
}

.map-container.collapsed{
  width: calc(100% + 8px);
}

.maplibregl-canvas-container.maplibregl-interactive {
  cursor: crosshair !important;
}
</style>
