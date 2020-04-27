import {
  getBaseDict
} from '@/api/modules/baseDict.js'

export default {
  state: {
    // 病理申请分类
    pathologyCategory: [],
    // 会诊分类
    consultationCategory: [],
    // 图像分类
    remoteImageCategorry: [],
    //
    dict: {}
  },
  mutations: {
    SET_PATHOLOGYCATEGORY (state, data) {
      state.pathologyCategory = data
    },
    SET_CONSULTATIONCATEGORY (state, data) {
      state.consultationCategory = data
    },
    SET_DICT (state, data) {
      state.dict[data.typeId] = data.data
    }
  },
  actions: {
    GetPathologyCategory ({
      commit,
      state
    }) {
      if (state.pathologyCategory.length > 0) {
        return false
      }
      return new Promise((resolve, reject) => {
        const Id = '12bd71b8-bfe2-4fd6-9f2b-20999846205e'
        getBaseDict(Id)
          .then(({
            data
          }) => {
            commit('SET_PATHOLOGYCATEGORY', data)
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetDict ({
      commit,
      state
    }, typeId) {
      return new Promise((resolve, reject) => {
        if (state.dict[typeId] && state.dict[typeId].length > 0) {
          resolve(state.dict[typeId])
          return false
        } else {
          console.log(1111)
          getBaseDict(typeId)
            .then(({
              data
            }) => {
              commit('SET_DICT', {
                typeId: data
              })
              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    }
  }
}
