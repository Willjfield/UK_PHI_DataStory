<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <v-container class="pa-0" fluid height="100dvh">
    <v-switch v-model="compareType" class="map-type-switch ma-2" density="compact" false-value="slider" hide-details
      true-value="sideBySide">
      <template #prepend>
        <div class="divide" />
        <v-icon id="split-map">mdi-map</v-icon>
      </template>
      <template #append>
        <v-icon>mdi-map</v-icon>|<v-icon>mdi-map</v-icon>
      </template>
    </v-switch>
    <div :class="{ collapsed: sidebarCollapsed }">
      <InfoPanel />
    </div>
    <v-row class="my-0" max-height="100dvh">
      <v-col class="pa-0 transition-all duration-500" :cols="sidebarCollapsed ? 12 : 8">
        <Map :_center="[-2, 55]" :_collapsed="sidebarCollapsed" :_type="compareType" :_zoom="4"
          style="height: 100dvh; width: 100%;" />
        <v-btn class="expand toggle-btn" :class="{ sidebarCollapsed }" color="primary"
          :prepend-icon="sidebarCollapsed ? 'mdi-chevron-left' : 'mdi-chevron-right'" size="x-small" stacked
          text="expand" variant="flat" @click="toggleSidebar" />
      </v-col>
      <v-col class="pa-0 transition-all duration-500" :cols="sidebarCollapsed ? 0 : 4" :style="{
        zIndex: 3,
        overflowY: 'hidden',
        width: sidebarCollapsed ? '0' : 'auto',
        maxHeight: '100dvh'
      }">
        <v-btn class="toggle-btn" :class="{ sidebarCollapsed }" color="primary"
          :prepend-icon="sidebarCollapsed ? 'mdi-chevron-left' : 'mdi-chevron-right'" rounded="0" size="x-small" stacked
          text="collapse" variant="flat" @click="toggleSidebar" />
        <div class="sidebar-content" :class="{ 'sidebar-hidden': sidebarCollapsed }">
          <div class="py-2" style="height: 3.5em; width:100%;">
            <v-img max-width="180px" src="/phi-uk_logo_small.png" style="margin:0 auto;" />
          </div>
          <v-divider />
          <div ref="scrollableContainer" class="scrollable-container">
            <div class="fade-bottom" />
            <v-card class="mx-8" title="Multiple Disadvantage vs. Access to Healthy Assets and Hazards" variant="text">
              <template #text>
                <p>This map compares <a
                    href="https://data.geods.ac.uk/dataset/index-of-multiple-deprivation-imd">indices
                    of multiple deprivation (IMD)</a> data from 2019 collected and published by The Geographic Data
                  Service along
                  with indicators of <a
                    href="https://data.geods.ac.uk/dataset/access-to-healthy-assets-hazards-ahah">Access to Healthy
                    Assets and Hazards (AHAH)</a>. Each nation measures deprivation in a slightly different way but the
                  broad themes include income, employment, education, health, crime, barriers to housing and services,
                  and the living environment. As you scroll through this sidebar, you will see the correlation of
                  various environmental factors from the AHAH data with the IMD in various places across the UK. Or you
                  can explore the map freely on your own.
                </p>
                <p>
                  IMD
                </p>
                <v-divider class="my-4"></v-divider>
                You can scroll down in this panel for a curated story of places of interest or explore the data on the
                map freely.
              </template>
            </v-card>

            <v-card class="pa-8" variant="text">
              <v-expansion-panels>
                <v-expansion-panel style="line-height: 1.1em;" title="What is Multiple Disadvantage?">
                  <template #text>
                    <h4>From <a href="https://meam.org.uk/multiple-needs-and-exclusions/">Making Every Adult Matter</a>:
                    </h4>
                    <br></br>
                    People facing multiple disadvantage experience a combination of problems. For many, their current
                    circumstances are shaped by long-term experiences of poverty, deprivation, trauma, abuse and
                    neglect.
                    Many
                    also face racism, sexism and homophobia. These structural inequalities intersect in different ways,
                    manifesting in a combination of experiences including homelessness, substance misuse, domestic
                    violence,
                    contact with the criminal justice system and mental ill health.
                    Multiple disadvantage is a systemic, not an individual issue. People facing multiple disadvantage
                    live
                    in
                    every area of the country. They are often failed by services and systems that focus on singular
                    issues.
                    This
                    makes it harder for individuals to address their problems, lead fulfilling lives and contribute
                    fully to
                    their communities.
                    The Index of Multiple Deprivation (IMD) datasets are small area measures of relative deprivation
                    across each of the constituent nations of the United Kingdom. Areas are ranked from the most
                    deprived area (rank 1) to the least deprived area. Each nation publishes its data on its own data
                    portal. Each nation measures deprivation in a slightly different way but the broad themes include
                    income, employment, education, health, crime, barriers to housing and services, and the living
                    environment.
                  </template>
                </v-expansion-panel>
                <v-expansion-panel style="line-height: 1.1em;" title="What are the geographies used?">
                  <template #text>
                    <h4>From the <a
                        href="https://www.ons.gov.uk/methodology/geography/ukgeographies/statisticalgeographies">Office
                        for National Statistics</a>:</h4>
                    <br></br>
                    The geographies used on the map are Lower layer Super Output Areas (LSOAs) for England and Wales,
                    Data Zones for Scotland and Super Output Areas or Wards (when data is available) for Northern
                    Ireland.
                  </template>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
            <v-divider />
            <div class="story-container">
            <v-card class="ma-8" subtitle="IMD percentile vs. PM10 Particulate Matter in the Air"
              title="Glasgow, Scotland" variant="text">
              <template #text>
                In this view of Glasgow, the left side displays the Index of Multiple Deprivation showing a higher level
                of deprivation around the city centre, north east of the city centre, Gorbals, and Govan. On the right,
                the mean annual PM10 particulate matter in the area displays a very similar pattern. Notably, the
                neighborhoods of Hillhead, Dowanhill, and Kelvinside, though directly between two areas with high
                Multiple Deprevation and PM10 levels, is lower in both.
              </template>
            </v-card>
            <!-- <v-divider /> -->
            <v-card class="ma-8" subtitle="IMD percentile vs. NDVI value indicating of Passive Green Space"
              title="Glasgow, Scotland" variant="text">
              <template #text>
                However, while NDVI (Normalized Difference Vegetation Index) is a reliable marker of tree canopy and
                other vegetation, the green space it reveals in Glasgow does not seem to map as neatly onto the IMD
                percentile.
              </template>
            </v-card>
            <!-- <v-divider /> -->
            <v-card class="ma-8" subtitle="IMD percentile vs. PM10 Particulate Matter in the Air"
              title="Liverpool, England" variant="text">
              <template #text>
                The same correlation can be seen in Liverpool though its seaside location likely complicates the relationship with currents of fresh air coming in.
              </template>
            </v-card>
          </div>
            <div style="width:100%; height:50%;"></div>
          </div>

          <v-btn block class="scroll-prompt" prepend-icon="mdi-chevron-down" variant="plain" />

        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import InfoPanel from '@/components/InfoPanel.vue'
import Map from '@/components/Map.vue'
const sidebarCollapsed = ref(false)
const compareType = ref('slider')
const scrollableContainer = ref<HTMLElement | null>(null)

const mitt = inject('mitt') as any

const stops = [{
  trigger: 300,
  target: 620,
  hasPlayed: false,
  location: {
    zoom: 10.44,
    center: [-4.2607, 55.8537],
  },
  leftIndicator: 'uk_imd2019_SOA_pct',
  rightIndicator: 'ahah_v4_ah4pm10'
},
{
  trigger: 870,
  target: 996,
  hasPlayed: false,
  location: {
    zoom: 10.44,
    center: [-4.2607, 55.8537],
  },
  leftIndicator: 'uk_imd2019_SOA_pct',
  rightIndicator: 'ahah_v4_ah4gpas'
},
{
  trigger: 1100,
  target: 1320,
  hasPlayed: false,
  location: {
    zoom: 10,
    center: [-2.9614034473615902, 53.432785564299905],
  },
  leftIndicator: 'uk_imd2019_SOA_pct',
  rightIndicator: 'ahah_v4_ah4pm10'
},

]



onMounted(() => {
  let isAnimating = false;
  scrollableContainer.value?.addEventListener('scroll', (e: any) => {
    const scrollTop = e.target.scrollTop
    for (const _stop of stops) {
      if (scrollTop > _stop.trigger && !_stop.hasPlayed && !isAnimating) {
        isAnimating = true
        _stop.hasPlayed = true
        e.target.scrollTop = _stop.target
        mitt.emit('go-to', { location: _stop.location, leftIndicator: _stop.leftIndicator, rightIndicator: _stop.rightIndicator, el: e.target, stop: _stop.target })

        setTimeout(() => isAnimating = false, 5000)
      }
    }
  })
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.transition-all {
  transition: all 0.5s ease-in-out;
}

.sidebar-content {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: 1;
  transform: translateX(0);
  height: 100%;
  background: white;

}

.sidebar-hidden {
  opacity: 0;
  transform: translateX(-100%);
  height: 0;

}

/* .sidebar-hidden */

.toggle-btn {
  position: fixed;
  top: 0%;
  transform: translateX(calc(-100%));
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}

.expand.toggle-btn {
  opacity: 0;
  display: none;
  transition-delay: 0.3s;
}

.sidebarCollapsed.toggle-btn {
  display: none;
}

.sidebarCollapsed.expand.toggle-btn {
  right: 0;
  opacity: 1;
  display: block;
  z-index: 0;
  transform: translateX(0%);
}

.scrollable-container {
  overflow-y: scroll;
  position: absolute;
  top: calc(3.5em);
  height: calc(100dvh - 3.5em);
}

.map-type-switch {
  position: absolute;
  z-index: 2;
  background: #ffffff69;
  padding: 0 4px;
  color: #474747;
  box-shadow: #00000026 3px 2px 12px;
}

.divide {
  position: absolute;
  border-right: 2px solid #ffffff;
  left: 15px;
  height: 1.5em;
  z-index: 1;
}

.fade-bottom {
  position: fixed;
  background: linear-gradient(0deg, white 19%, transparent 36%);
  z-index: 2;
  pointer-events: none;
  height: 100%;
  left: 0;
  right: 0;
}

.scroll-prompt {
  position: absolute;
  bottom: 0;
  z-index: 3;
}
</style>
<style>
.story-container .v-card{
  margin-bottom: 25dvh !important;
}
.map-type-switch.v-input--horizontal .v-input__prepend {
  margin-inline-end: 8px;
}

.map-type-switch.v-input--horizontal .v-input__append {
  margin-inline-start: 8px;
}
</style>
