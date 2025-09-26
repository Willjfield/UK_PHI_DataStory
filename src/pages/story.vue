<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <v-container class="pa-0" fluid height="100dvh">
    <v-row class="my-0" max-height="100dvh">
      <v-col class="pa-0 transition-all duration-500" :cols="sidebarCollapsed ? 12 : 8">
        <Map :_center="[-2, 55]" :_collapsed="sidebarCollapsed" :_zoom="4" style="height: 100dvh; width: 100%;" />
        <v-btn
          class="expand toggle-btn" :class="{ sidebarCollapsed }" color="primary"
          :prepend-icon="sidebarCollapsed ? 'mdi-chevron-left' : 'mdi-chevron-right'" size="x-small" stacked
          text="expand" variant="flat" @click="toggleSidebar"
        />
      </v-col>
      <v-col
        class="pa-0 transition-all duration-500" :cols="sidebarCollapsed ? 0 : 4" :style="{

          overflowY: 'hidden',
          width: sidebarCollapsed ? '0' : 'auto',
          maxHeight: '100dvh'
        }"
      >
        <v-btn
          class="toggle-btn" :class="{ sidebarCollapsed }" color="primary" :prepend-icon="sidebarCollapsed ? 'mdi-chevron-left' : 'mdi-chevron-right'"
          rounded="0" size="x-small" stacked
          text="collapse" variant="flat" @click="toggleSidebar"
        />
        <div class="sidebar-content" :class="{ 'sidebar-hidden': sidebarCollapsed }">
          <div class="py-2" style="height: 3.5em; width:100%">
            <v-img max-width="180px" src="/phi-uk_logo_small.png" style="margin:0 auto;" />
          </div>
          <v-divider />
          <div class="scrollable-container">
            <v-card class="mx-8" subtitle="What is multiple disadvantage?" title="Multiple Disadvantage" variant="text">
              <template #text>
                People facing multiple disadvantage experience a combination of problems. For many, their current
                circumstances are shaped by long-term experiences of poverty, deprivation, trauma, abuse and neglect.
                Many
                also face racism, sexism and homophobia. These structural inequalities intersect in different ways,
                manifesting in a combination of experiences including homelessness, substance misuse, domestic violence,
                contact with the criminal justice system and mental ill health.
                Multiple disadvantage is a systemic, not an individual issue. People facing multiple disadvantage live
                in
                every area of the country. They are often failed by services and systems that focus on singular issues.
                This
                makes it harder for individuals to address their problems, lead fulfilling lives and contribute fully to
                their communities.
              </template>
            </v-card>
            <v-btn block prepend-icon="mdi-chevron-down" variant="plain">Scroll down to read more</v-btn>
            <v-card class="ma-8" subtitle="First part" title="The Story" variant="text">
              <template #text>
                Story 1
              </template>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import Map from '@/components/map.vue'

  const sidebarCollapsed = ref(false)

  function toggleSidebar () {
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
  top: calc(3.5em + 16px);
  height: calc(100dvh - 3.5em - 16px);
}
</style>
