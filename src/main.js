import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { loadFonts } from "./plugins/webfontloader";
import "./index.css";
import ElementPlus from "element-plus";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import "element-plus/dist/index.css";

loadFonts();

createApp(App)
  .use(router)
  .use(store)
  .use(ElementPlus)
  .use(VueGoogleMaps, {
    load: {
      key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
    },
  })
  .mount("#app");
