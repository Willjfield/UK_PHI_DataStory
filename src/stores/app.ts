// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    leftHover: null as null | { side: 'left', props: any[] },
    rightHover: null as null | { side: 'right', props: any[] },
    eitherHover: null as null | { side: string, props: any[] },
  }),
  actions: {
    setLeftHover (payload: { side: 'left', props: any[] }) {
      this.leftHover = payload
    },
    setRightHover (payload: { side: 'right', props: any[] }) {
      this.rightHover = payload
    },
    setEitherHover (payload: { side: string, props: any[] }) {
      this.eitherHover = payload
    },
    clearHover () {
      this.leftHover = null
      this.rightHover = null
      this.eitherHover = null
    },
  },
})
