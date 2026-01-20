import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'
import storage from './storage'

const TOKEN_ERROR = 'Token认证失败,请重新登录'
const NETWORK_ERROR = '网络错误,请稍后重试'

// 创建 axios 的实例对象 添加配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截器
service.interceptors.request.use((req) => {
  // 一些公共的请求的机制
  const header = req.headers
  const {token = ""} = storage.getItem('userInfo') || {}
  if (!header.Authorization) {
    header.Authorization = `Bearer ${token}`
  }
  return req
})

// 响应拦截器
service.interceptors.response.use(
  res => {
    // 一些公共的响应的机制
    const { code, data, msg } = res.data

    if (code === 200) {
      return data
    } else if (code === 50001) {
      ElMessage.error(TOKEN_ERROR)
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      return Promise.reject(TOKEN_ERROR)
    } else {
      // 显示后端返回的错误信息：优先使用 data（字符串类型），其次使用 msg
      const errorMsg = (typeof data === 'string' && data) || msg || NETWORK_ERROR
      ElMessage.error(errorMsg)
      return Promise.reject(errorMsg)
    }
  },
  error => {
    // 处理网络错误、连接被拒绝等情况
    if (error.response) {
      // 服务器返回了响应，但状态码不在 2xx 范围内
      const responseData = error.response.data || {}
      const { code, data, msg } = responseData
      // 优先使用 data（字符串类型），其次使用 msg
      const errorMsg = (typeof data === 'string' && data) || msg || NETWORK_ERROR
      ElMessage.error(errorMsg)
      return Promise.reject(errorMsg)
    } else if (error.request) {
      // 请求已发出，但没有收到响应（可能是后端服务器未启动）
      ElMessage.error('无法连接到服务器，请检查后端服务是否启动')
      return Promise.reject('无法连接到服务器')
    } else {
      // 其他错误
      ElMessage.error(error.message || NETWORK_ERROR)
      return Promise.reject(error.message || NETWORK_ERROR)
    }
  }
)

// 核心的 request 函数
function request(options) {
  options.method = options.method || "get"

  if (options.method.toLowerCase() === "get") {
    options.params = options.data
  }

  // 判断是否使用 mock：优先使用请求中的 mock 参数，否则使用全局配置
  const useMock = typeof options.mock !== 'undefined' ? options.mock : config.mock

  // 设置 baseURL：生产环境总是使用 baseApi，其他环境根据 mock 配置决定
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = useMock && config.mockApi ? config.mockApi : config.baseApi
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