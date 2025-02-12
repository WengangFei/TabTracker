import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure MDI icons are imported

const pinia = createPinia();
pinia.use(piniaPersist);
const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
})
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount('#app');
