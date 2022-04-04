import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const PageHome = () => import('./../views/pageHome.vue')
const PageMock = () => import('./../views/pageMock.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: PageHome
    },
    {
      path: '/mock',
      name: 'mock',
      component: PageMock
    }
  ] as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router