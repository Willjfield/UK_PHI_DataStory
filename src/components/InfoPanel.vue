<template>
   <v-card class="info-panel" :class="{'collapsed':sidebarCollapsed}" title="Info panel">
      <v-table density="compact">
        <tbody>
          <tr>
            <td colspan="2">
              <pre v-if="eitherHover" class="mini-pre">{{ summarize(eitherHover.props) }}</pre>
              <span v-else>—</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
 </template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

const props = defineProps<{ sidebarCollapsed?: boolean }>()

const appStore = useAppStore()
const { leftHover, rightHover, eitherHover } = storeToRefs(appStore)

function summarize(propsArr: any[]) {
  try {
    return JSON.stringify(propsArr, null, 2)
  } catch (e) {
    return ''
  }
}
</script>
<style>
.info-panel{
  position: absolute !important;
  left: 33.4%;
    transform: translateX(-50%);
    z-index: 3 !important;
    transition: left 0.3s ease-in-out;
    max-width: min-content;
    overflow: scroll;
}

.info-panel.collapsed{
  left: 50%;
  transition: left 0.3s ease-in-out;
}

.mini-pre{
  margin: 0;
  max-width: 420px;
  white-space: pre-wrap;
  font-size: 11px;
}
</style>
