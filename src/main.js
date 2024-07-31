import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { loadFonts } from './plugins/webfontloader'
import "./index.css"
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(ElementPlus)
  .mount('#app')
