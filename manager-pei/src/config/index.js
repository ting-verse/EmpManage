// 环境配置封装
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseApi: '/',
    mockApi: 'https://mock.apipark.cn/m1/4068509-0-default/api'
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://mock.apipark.cn/m1/4068509-0-default/api'
  },
  prod: {
    baseApi: '//future.com/api',
    mockApi: 'https://mock.apipark.cn/m1/4068509-0-default/api'
  }
}

export default {
  env,
  mock:true,
  ...EnvConfig[env]
}