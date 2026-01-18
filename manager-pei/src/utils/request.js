import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'

const TOKEN_ERROR = 'Token认证失败,请重新登录'
const NETWORK_ERROR = '网络错误,请稍后重试'

// 创建 axios 的实例对象 添加配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

service.interceptors.request.use((req) => {
  // 一些公共的请求的机制
  const header = req.headers
  if (!header.Authorization) {
    header.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
  return req
})

service.interceptors.response.use(res => {
  // 一些公共的响应的机制
  const { code, data, msg } = res.data

  if (code === 200) {
    return data
  } else if (code === 40001) {
    ElMessage.error(TOKEN_ERROR)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_ERROR)
  } else {
    ElMessage.error(NETWORK_ERROR)
    return Promise.reject(NETWORK_ERROR)
  }
})

// 核心的 request 函数
function request(options) {
  options.method = options.method || "get"

  if (options.method.toLowerCase() === "get") {
    options.params = options.data
  }

  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mockApi ? config.mockApi : config.baseApi
  }

  return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
  request[method] = (url, data, options) => {
    return request({
      url,
      method,
      data,
      ...options
    })
  }
})

export default request