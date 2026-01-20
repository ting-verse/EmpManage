import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: () => import('../components/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import('../views/Welcome.vue'),
      },
      {
        name: 'system',
        path: '/system',
        meta: {
          title: '系统管理'
        },
        component: () => import('../views/Welcome.vue'),
        children: [
          {
            name: 'user',
            path: 'user',  // 相对路径，会自动拼接为 /system/user
            meta: {
              title: '用户管理'
            },
            component: () => import('../views/Welcome.vue'),
          }
        ]
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页'
    },
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
