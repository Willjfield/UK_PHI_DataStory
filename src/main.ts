/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

import mitt from 'mitt'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.provide('mitt', mitt())
registerPlugins(app)

app.mount('#app')
