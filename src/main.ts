/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

import EventEmitter from 'mitt'

const app = createApp(App)

app.provide('mitt', new EventEmitter())
registerPlugins(app)

app.mount('#app')
