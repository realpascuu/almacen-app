import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import { createPinia } from 'pinia'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(router)
  .use(createPinia())
  .use(vuetify)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
