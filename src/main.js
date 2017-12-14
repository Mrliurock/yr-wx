// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueScroller from 'vue-scroller'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
Vue.use(VueScroller)
Vue.use(VueLazyload, {
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove', 'mousemove']
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
