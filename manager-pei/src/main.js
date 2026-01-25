import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/style/index.scss'
import './assets/style/reset.css'
import router from './router'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'

const app = createApp(App)

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.directive('has', {
  mounted:(el, binding) => {
    let userAction = storage.getItem('actionList') || []
    let value = binding.value
    let hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style.display = 'none'
      setTimeout(() => {
        el.parentElement.removeChild(el)
      }, 0)
    }
  } 
})
app.use(ElementPlus, { size: 'small' }).use(router).use(store).mount('#app')