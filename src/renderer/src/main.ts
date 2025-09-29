import './assets/main.css'
import router from './router'
import 'element-plus/dist/index.css'
import elementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(router)
app.use(elementPlus)
app.mount('#app')
