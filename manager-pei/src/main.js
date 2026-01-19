import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/style/index.scss'
import './assets/style/reset.css'
import router from './router'
import request from './utils/request'
import storage from './utils/storage'

const app = createApp(App)

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage

app.use(ElementPlus).use(router).mount('#app')