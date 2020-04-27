import { getBaseDict } from '../api/modules/baseDict.js'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return (
    JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !==
      -1 || false
  )
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/*
日期转换
* */

export function formatDateTime (date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

/**
 * @param {Object} params
 *
 * @export
 */
export function herf () {}
herf.open = params => {
  let query = ''
  let url = ''
  if (Object.keys(params.query).length > 0) {
    url = params.url + '?'
    for (let key in params.query) {
      query += `${key}=${params.query[key]}&`
    }
    window.open(url + query)
  } else {
    url = params.url
    window.open(url)
  }
}

export function getDict (id) {
  return new Promise((resolve, reject) => {
    const dictList = sessionStorage.getItem(id)
    if (!dictList) {
      getBaseDict(id).then(({ data }) => {
        sessionStorage.setItem(id, JSON.stringify(data))
        resolve(data)
      })
    }
    if (!dictList || dictList.length === 0) {
      getBaseDict(id).then(({ data }) => {
        sessionStorage.setItem(id, JSON.stringify(data))
        resolve(data)
      })
    } else {
      resolve(dictList)
    }
  })
}
