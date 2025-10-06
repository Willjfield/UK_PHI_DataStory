<template>
  <div id="comparison-container">
    <div ref="mapContainerLeft" class="map-container" :class="{ collapsed: _collapsed }">
      <v-card class="ma-4 legend" :style="{ left: '15px', 'max-width': (compareWidth * .75) + 'px', 'min-width': '390px' }">
        <template #title>
          <v-select
            v-model="selectedLeftIndicator"
            class="indicator-selector"
            density="compact"
            hide-details
            item-title="label"
            :items="indicators"
            label="Left Map Indicator"
            return-object
            width="100%"
            @update:model-value="(val) => changeIndicator(val, leftMap, leftStyle, 'left')"
          />
        </template>
        <template #text>
          <div class="actual-legend-bit">
            <div v-if="selectedLeftIndicator.type === 'rank'">
              <LegendRank :indicator="selectedLeftIndicator" />
            </div>
            <div v-else-if="selectedLeftIndicator.type === 'pct'">
              <LegendPct :indicator="selectedLeftIndicator" />
            </div>
            <div v-else-if="selectedLeftIndicator.type === 'dec'">
              <LegendDec :indicator="selectedLeftIndicator" />
            </div>
            <div v-else>
              <LegendRank :indicator="selectedLeftIndicator" />
            </div>
          </div>
          <v-expansion-panels v-show="selectedLeftIndicator?.description" static>
            <v-expansion-panel class="more-info-expand" :text="selectedLeftIndicator?.description" title="Details" />
          </v-expansion-panels>
        </template>
      </v-card>
    </div>
    <div ref="mapContainerRight" class="map-container" :class="{ collapsed: _collapsed }" />
    <v-card
      class="ma-4 legend legend-right"
      :class="{ collapsed: _collapsed }"
      :style="{
        'max-width': ((_window.innerWidth - compareWidth) * .25) + 'px', 'min-width': '360px'
      }"
    >
      <template #title>
        <v-select
          v-model="selectedRightIndicator"
          class="indicator-selector"
          density="compact"
          hide-details
          item-title="label"
          :items="indicators"
          label="Right Map Indicator"
          return-object
          width="100%"
          @update:model-value="(val) => changeIndicator(val, rightMap, rightStyle, 'right')"
        />
      </template>
      <template #text>
        <div class="actual-legend-bit">
          <div v-if="selectedRightIndicator.type === 'rank'">
            <LegendRank :indicator="selectedRightIndicator" />
          </div>
          <div v-else-if="selectedRightIndicator.type === 'pct'">
            <LegendPct :indicator="selectedRightIndicator" />
          </div>
          <div v-else-if="selectedRightIndicator.type === 'dec'">
            <LegendDec :indicator="selectedRightIndicator" />
          </div>
          <div v-else>
            <LegendRank :indicator="selectedRightIndicator" />
          </div>
        </div>
        <v-expansion-panels v-show="selectedRightIndicator?.description" static>
          <v-expansion-panel class="more-info-expand" :text="selectedRightIndicator?.description" title="Details" />
        </v-expansion-panels>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
  import maplibregl from 'maplibre-gl'
  import { Protocol } from 'pmtiles'
  import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
  import * as mapStyle from '@/assets/basic.json'
  import { indicators } from '@/assets/indicators.json'
  import Compare from '@/assets/maplibre-gl-compare.js'
  import LegendDec from './LegendDec.vue'
  import LegendPct from './LegendPct.vue'
  import '@/assets/maplibre-gl-compare.css'

  const mitt = inject('mitt')

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

  const choroplethIDs: Set<string> = new Set(['oa-england-wales-2021_ahah', 'oa-england-2011_imd', 'oa-wales-2011_imd', 'oa-scotland', 'oa-northern-ireland'])

  const defaultLeftIndicatorField = 'uk_imd2019_SOA_decile'
  const leftStyle = JSON.parse(JSON.stringify(mapStyle))

  const defaultRightIndicatorField = 'ahah_v4_ah4ahah_pct'
  const rightStyle = JSON.parse(JSON.stringify(mapStyle))

  const selectedLeftIndicatorField = ref(defaultLeftIndicatorField)
  const selectedRightIndicatorField = ref(defaultRightIndicatorField)

  const selectedLeftIndicator = ref(indicators.find(i => i.field === selectedLeftIndicatorField.value))
  const selectedRightIndicator = ref(indicators.find(i => i.field === selectedRightIndicatorField.value))

  const _window = ref(window)
  function changeIndicator (_indicator: any, map: maplibregl.Map | null, style: any, side: string) {
    const isAHAHIndicator = _indicator.field.includes('ahah')
    style.layers = style.layers.map((l: { id: string, paint: { [x: string]: any }, layout: any }) => {
      if (choroplethIDs.has(l.id)) {
        l.paint['fill-color'] = _indicator['fill-color']
        l.layout = {}
      }
      if (l.id.includes('2021_ahah')) {
        l.layout.visibility = isAHAHIndicator ? 'visible' : 'none'
      } else if (l.id.includes('oa-england') || l.id.includes('oa-wales')) {
        l.layout.visibility = isAHAHIndicator ? 'none' : 'visible'
      }
      return l
    })
    mitt.emit(`${side}-indicator-update`, _indicator)
    map?.setStyle(style)
  }

  changeIndicator(selectedLeftIndicator.value, null, leftStyle, 'left')
  changeIndicator(selectedRightIndicator.value, null, rightStyle, 'right')

  mitt.on('go-to', target => {
    leftMap?.flyTo({ center: target.location.center, zoom: target.location.zoom })
    const newLeft = indicators.find(i => i.field === target.leftIndicator)
    const newRight = indicators.find(i => i.field === target.rightIndicator)
    //console.log(newLeft.field, newRight.field)

    leftMap?.once('idle',()=>{
      target.el.scrollTop = target.stop
    })
      selectedLeftIndicator.value = newLeft
      selectedRightIndicator.value = newRight
      changeIndicator(newLeft, leftMap, leftStyle, 'left')
      changeIndicator(newRight, rightMap, rightStyle, 'right')
  })

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
        const features = leftMap.queryRenderedFeatures(e.point, { layers: choroplethIDs })
        if (features.length === 0) return
        // console.log('LEFT MAP')
        const props = features?.map(f => f.properties)
        mitt.emit('left-update', props)
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
        const features = rightMap.queryRenderedFeatures(e.point, { layers: choroplethIDs })
        if (features.length === 0) return
        const props = features?.map(f => f.properties)
        mitt.emit('right-update', props)
      })
    }

    leftMap?.on('idle',()=>{
      console.log(leftMap?.getCenter(), leftMap?.getZoom())

    })

    _compare = new Compare(leftMap, rightMap, comparisonContainer, { type: props._type })

    _compare.on('slideend', (e: { currentPosition: number }) => {
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

.legend,
.legend-right {
  background: transparent !important;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid #e0e0e0 !important;
  border-top: 1px solid #e0e0e0 !important;
  border-left: 1px solid #e0e0e0 !important;
  border-right: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  margin: 8px !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  zoom: .8;
  transition: zoom 0.3s ease-in-out;
}
.collapsed .legend, .legend.collapsed{
  zoom: 1;
  transition: zoom 0.3s ease-in-out;
}
.legend.legend-right.collapsed {

  right: 0%;
  transition: right 0.3s ease-in-out;
}

.legend>.v-card-item {
  padding-bottom: 1px !important;
}
.actual-legend-bit{
 background: rgba(255,255,255,.5);
 padding: 2px;
}
.more-info-expand {
  margin-bottom: 4px;
}

.more-info-expand .v-expansion-panel-title {
  padding: 4px 18px !important;

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

.indicator-selector .v-select__selection .v-select__selection-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.2em;
  font-weight: bold;
  padding: 4px;
}
</style>
