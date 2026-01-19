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
