/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */


// Composables
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'
import 'vuetify/styles'
// Styles
import '@mdi/font/css/materialdesignicons.css'
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#fff',
          secondary: colors.indigo.lighten4,
          surface: colors.indigo.lighten5,
          text: colors.indigo.darken3,
          logoBlue: '#53ddf8',
          logoRed: '#fb9d77',
          logoGreen: '#1fb292',
          logoOrange: '#f0d464',
          phiOrange: '#f2bd60',
          phiRed: '#ff6153',
          phiYellow: '#ead56d',
        },
      },
    },
  },
})
