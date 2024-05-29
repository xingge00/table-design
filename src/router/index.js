import { createRouter, createWebHashHistory } from 'vue-router'
import NotFound from '@/views/404'

const pageConfig = import.meta.globEager('../views/**/index.vue')
const getName = path => path.slice(9, -10)

const routes = [

  ...Object.entries(pageConfig).map(([path, component]) => ({
    path: `/${getName(path)}`,
    name: getName(path),
    component: component.default,
  })).sort(a => Number(a.path !== '/Home') - 0.5),

  {
    path: '/',
    redirect: '/Home',
  },
  {
    path: '/:path(.*)',
    component: NotFound,
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
