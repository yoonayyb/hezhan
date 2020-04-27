import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import permission from './modules/permission'
import tagView from './modules/tagView'
import dict from './modules/dict'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    permission,
    tagView,
    dict
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [persistedState()]
})
