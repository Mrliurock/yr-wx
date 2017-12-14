import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import City from '@/pages/City'
import Guide from '@/pages/Guide'
import Scenic from '@/pages/Scenic'
import ScenicArea from '@/pages/ScenicArea'
import Images from '@/pages/Images'
import Order from '@/pages/Order'
import Pay from '@/pages/Pay'
import Payed from '@/pages/Payed'
import Strategy from '@/pages/Strategy'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: window.proname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {keepAlive: false}
    },
    {
      path: '/city',
      name: 'city',
      component: City,
      meta: {keepAlive: false}
    },
    {
      path: '/home',
      component: Home,
      meta: {keepAlive: false}
    },
    {
      path: '/guide',
      name: 'guide',
      component: Guide,
      meta: {keepAlive: true}
    },
    {
      path: '/scenic',
      name: 'scenic',
      component: Scenic,
      meta: {keepAlive: false}
    },
    {
      path: '/scenicArea',
      name: 'scenicArea',
      component: ScenicArea,
      meta: {keepAlive: false}
    },
    {
      path: '/images',
      name: 'images',
      component: Images,
      meta: {keepAlive: false}
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      meta: {keepAlive: false}
    },
    {
      path: '/pay',
      name: 'pay',
      component: Pay,
      meta: {keepAlive: false}
    },
    {
      path: '/payed',
      name: 'payed',
      component: Payed,
      meta: {keepAlive: false}
    },
    {
      path: '/strategy',
      name: 'strategy',
      component: Strategy,
      meta: {keepAlive: false}
    }
  ]
})
