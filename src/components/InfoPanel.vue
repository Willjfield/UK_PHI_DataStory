<template>
  <div class="info-panel">
    <v-card
      v-if="leftProps"
      class="left half"
      :subtitle="(leftProps.LSOA21NM || leftProps.uk_imd2019_LANAME)+':'+(leftProps.LSOA21CD || leftProps.LSOA11_CD || leftProps.SOA2011)"
      :title="leftProps ? (leftProps.LSOA21CD ? '2021 Output Area' : '2011 Output Area') : ''"
      width="50%"
    >
    <template #text>
      <v-divider></v-divider>
      <div class="half">{{ leftIndicator.label }}: <b>{{leftProps[leftIndicator.field]}}</b></div>
    </template>
    </v-card>
    <v-card
      v-if="rightProps"
      class="right half"
      :subtitle="(rightProps.LSOA21NM || rightProps.uk_imd2019_LANAME)+':'+(rightProps.LSOA21CD || rightProps.LSOA11_CD || rightProps.SOA2011)"
      :title="rightProps ? (rightProps.LSOA21CD ? '2021 Output Area' : '2011 Output Area') : ''"
      width="50%"
    >
    <template #text>
      <v-divider></v-divider>
      <div class="half">{{ rightIndicator.label }}: <b>{{rightProps[rightIndicator.field]}}</b></div>
    </template>
    </v-card>
  </div>
</template>
<script lang="ts" setup>
  import { inject, ref } from 'vue'

  const mitt: any = inject('mitt')
  const leftProps = ref()
  const rightProps = ref()

  const leftIndicator = ref()
  const rightIndicator = ref()

  mitt.on('left-indicator-update', (val: any) => {
    leftIndicator.value = val
  })

  mitt.on('right-indicator-update', (val: any) => {
    rightIndicator.value = val
  })

  mitt.on('left-update', (props: any) => {
    leftProps.value = props.length === 1 ? { ...props[0] } : { ...props[0], ...props[1] }
  })

  mitt.on('right-update', (props: any) => {
    rightProps.value = props.length === 1 ? { ...props[0] } : { ...props[0], ...props[1] }
  })

</script>
<style>
.info-panel{
  position: absolute !important;
  z-index: 3;
  height: 7em !important;
  width: 450px;
  left: 33.3%;
  transform:translateX(-50%);
  transition: left 0.3s ease-in-out;
}
.collapsed .info-panel{
  left: 50%;
  transition: left 0.3s ease-in-out;
}

.half{
  display: inline-block !important;
  height: 100%;
}
.half .v-card-title{
  font-size: .9em !important;
}

.half .v-card-item{
  padding-bottom: 0;
}

.half .v-card-text{
  font-size: 12px;
  line-height: 14px;
}

.right{
  float:right;
}
</style>
