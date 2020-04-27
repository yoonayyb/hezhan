import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import SignParams from '@/utils/signParams'
import {
  Base64
} from 'js-base64'
import {
  sha256
} from 'js-sha256'
import {
  Message
} from 'element-ui'

const baseUrl =
  process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ?
  '/proxyApi' :
  window.SITE_CONFIG.baseUrl
const http = axios.create({
  timeout: 1000 * 60,
  withCredentials: false, // 生产环境改成false，不然打包出来会出现跨域
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})
/**
 * 请求拦截
 */
let signParams = new SignParams()
http.interceptors.request.use(
  config => {
    /* 请求之前给请求的参数都带上token */
    let _data = {}
    if (config.method === 'get') {
      _data = config.params || {}
    } else if (config.method === 'post') {
      _data = config.data || {}
    }

    let _stamp = signParams.getUnifiedTime().getTime().toString()
    let _access = localStorage.getItem('access_token')
    let _header = {
      'token': '',
      'stamp': _stamp,
      'access': _access
    }

    let private_key = localStorage.getItem('private_key')
    let unsign = Base64.encode(JSON.stringify(_header)) + '.' + Base64.encode(JSON.stringify(_data))
    let sign = sha256(unsign + '.' + private_key)

    let _token = unsign + '.' + Base64.encode(sign)

    config.headers['token'] = _token
    config.headers['stamp'] = _stamp
    config.headers['access'] = _access
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
/**
 * 响应拦截
 */
let errorOnce = true
http.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 401) {
      // 401, token失效
      Vue.cookie.delete('token')
      router.options.isAddDynamicMenuRoutes = false
      router.push({
        name: 'login'
      })
    }
    return response
  },
  error => {
    console.log(error.response)
    try {
      if (!error.response) {
        Message({
          type: 'error',
          message: error.response.data.msg,
          duration: 1000
        })
        return Promise.reject(error)
      }
      if (error.response.status === 401) {
        router.options.isAddDynamicMenuRoutes = false
        if (errorOnce) {
          errorOnce = false
          router.push({
            name: 'login'
          })
          errorOnce = true
          // Message({
          //   type: 'error',
          //   message: error.response.data,
          //   duration: 1000,
          //   onClose: () => {

          //     errorOnce = true
          //   }
          // })
        }
      } else {
        Message({
          type: 'error',
          message: error.response.data.msg,
          duration: 1000
        })
      }
    } catch (error) {
      Message({
        type: 'error',
        message: error.response.data.msg,
        duration: 1000
      })
    }
    // 请求失败处理

    return Promise.reject(error)
  }
)

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = actionName => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (
    (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ?
      '/proxyApi' :
      window.SITE_CONFIG.baseUrl) + actionName
  )
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    // 't': new Date().getTime()
  }

  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    // 't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
