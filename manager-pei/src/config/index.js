// 环境配置封装
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseApi: '/api',
    // mockApi: 'https://mock.apipark.cn/m1/4068509-0-default/api'
    mockApi:'http://127.0.0.1:4523/m1/7729305-7473289-default'
  },
  test: {
    baseApi: '//test.future.com/api',
    // mockApi: 'https://mock.apipark.cn/m1/4068509-0-default/api'
    mockApi:'http://127.0.0.1:4523/m1/7729305-7473289-default'
  },
  prod: {
    baseApi: '//future.com/api',
    // mockApi: 'https://mock.apipark.cn/m1/4068509-0-default/api'
    mockApi:'http://127.0.0.1:4523/m1/7729305-7473289-default'
  }
}

export default {
  env,
  mock:true,
  ...EnvConfig[env],
  namespace:'manage'
}