import Vue from 'vue'
import App from '@/App'
import router from '@/router' // api: https://github.com/vuejs/vue-router
import store from '@/store' // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie' // api: https://github.com/alfhen/vue-cookie
import 'element-ui/lib/theme-chalk/index.css'
import '@/element-ui' // api: https://github.com/ElemeFE/element
import '@/icons' // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/iconfont/iconfont.css'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import moment from 'moment'
import selectModel from './components/selectModel/index.js'
import permission from '@/directives/permission/index'
import 'default-passive-events'
Vue.use(permission)
Vue.use(VueCookie)
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.filter('formatTime', val => {
  if (val) {
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return ''
  }
})

Vue.filter('formatTimeI', val => {
  if (val) {
    return moment(val).format('YYYY-MM-DD')
  } else {
    return ''
  }
})

Vue.filter('formatTimeII', val => {
  if (val) {
    return moment(val).format('YYYY-MM-DD HH:mm')
  } else {
    return '-'
  }
})
// 挂载全局
Vue.prototype.$moment = moment
Vue.prototype.$http = httpRequest
// 域名
Vue.prototype.$url = window.SITE_CONFIG['baseUrl']
// 切换 科达和远见设备的
Vue.prototype.$device = window.SITE_CONFIG['device']
// dicom文件下载地址
Vue.prototype.$dicomFileDownUrl = window.SITE_CONFIG['dicomFileDownUrl']
// dicom文件查看地址
Vue.prototype.$dicomUrl = window.SITE_CONFIG['dicomUrl']

Vue.prototype.$selectModel = selectModel

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
