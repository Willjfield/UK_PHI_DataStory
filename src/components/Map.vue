<template>
    <div ref="mapContainer" class="map-container" />
</template>

<script lang="ts" setup>
  import maplibregl from 'maplibre-gl'
  import { Protocol } from 'pmtiles'
  import { onMounted, onUnmounted, ref } from 'vue'
  import * as mapStyle from '@/assets/basic.json'

  const mapContainer = ref<HTMLElement>()
  let map: maplibregl.Map | null = null

  const protocol = new Protocol()
  maplibregl.addProtocol('pmtiles', protocol.tile)

  // Define props with default values if needed
  const props = defineProps<{
    _center: [number, number]
    _zoom: number
  }>()

  onMounted(() => {
    console.log(mapStyle)
    // Ensure the container is properly initialized
    if (mapContainer.value) {
      map = new maplibregl.Map({
        container: mapContainer.value, // use ref instead of string id
        style: mapStyle,
        center: props._center,
        zoom: props._zoom,
      })

      map.on('load', () => {
        console.log('Map loaded successfully')
      })

      map.on('error', e => {
        console.error('Map error:', e)
      })

      map.on('mousemove', e => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['oa-england', 'oa-wales', 'oa-scotland', 'oa-northern-ireland'] })
        if (features.length === 0) return
        console.log(features[0]?.properties)
      })
    }
  })

  onUnmounted(() => {
    if (map) {
      map.remove()
    }
  })
</script>
<style>
.map-container{
  width: 100%;
  height: 100%;
  cursor: crosshair !important;
}
.maplibregl-canvas-container.maplibregl-interactive{
  cursor: crosshair !important;
}
</style>
