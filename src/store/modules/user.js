import {
  login,
  rankList
} from '@/utils/api'
import {
  getUserInfo
} from '@/api/modules/login.js'
export default {
  state: {
    id: 0,
    name: '',
    token: '',
    userInfo: {},
    rank: '' //优先级
  },
  mutations: {
    updateId(state, id) {
      state.id = id
    },
    updateName(state, name) {
      state.name = name
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_RANK(state, rank) {
      state.rank = rank
    }
  },
  actions: {
    getRank({
      commit
    }) {
      return new Promise((resolve, reject) => {
        rankList({
            TypeId: '1'
          })
          .then(res => {
            console.log(res)
            if (res.data && res.data.Status === 0) {
              let rank = res.data.PageList
              commit('SET_RANK', rank)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    LoginByUserName({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            if (res.data && res.data.Status === 0) {
              let user = res.data
              commit('SET_TOKEN', user.Data.ACCESS_KEY)
              commit('SET_USERINFO', user.Data)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async getUserInfo({
      commit
    }) {
      const {
        data
      } = await getUserInfo()
      if (data && data.status === 0) {
        commit('SET_USERINFO', data.data)
      }
    }
  }
}
