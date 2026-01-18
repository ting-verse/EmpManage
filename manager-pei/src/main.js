import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

createApp(App).use(ElementPlus).use(router).mount('#app')


console.log('环境变量',import.meta.env)