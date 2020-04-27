import {
  hex_md5
} from './md5.js'

/**
 * 传入数组
 * 按字母顺序,升序
 * 冒泡排序
 */
function getKeySort(strArr) {
  var compareInt = 0
  for (var i = 0; i < strArr.length; i++) {
    for (var j = 0; j < strArr.length - 1 - i; j++) {
      compareToIndexValue(strArr, compareInt, j)
    }
  }
  return strArr
}

// 根据首字母 排序,如果首字母相同则根据第二个字母排序...直到排出大小
function compareToIndexValue(arr, int, arrIndex) {
  let ahead = arr[arrIndex].toLowerCase().substr(int, int + 1)
  let back = arr[arrIndex + 1].toLowerCase().substr(int, int + 1)
  if (ahead === back) compareToIndexValue(arr, int + 1, arrIndex)
  // 如果第一位相等,则继续比较第二个字符
  else if (ahead.toLowerCase() > back.toLowerCase()) {
    var temp = arr[arrIndex + 1]
    arr[arrIndex + 1] = arr[arrIndex]
    arr[arrIndex] = temp
  }
}

function isEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
      break
    case 'boolean':
      if (!v) return true
      break
    case 'number':
      if (isNaN(v)) return true
      break
    case 'object':
      if (v === null || v.length === 0) return true
      for (var i in v) {
        return false
      }
      return true
  }
  return false
}

export default class SignParams {
  // 提交的参数
  getParams(obj) {
    let timestamp = this.getUnifiedTime().getTime()
    let baseSign = {
      ...obj,
      time_stamp: timestamp,
      private_key: localStorage.getItem('private_key'),
      access_token: localStorage.getItem('access_token')
    }
    let _sign = hex_md5(this.sortParams(baseSign))

    let params = {
      sign: _sign,
      time_stamp: timestamp,
      access_token: localStorage.getItem('access_token')
    }

    return params
  }
  // 现在时间与服务器时间的时间差
  getUnifiedTime() {
    var now = new Date()
    var serverLocalTimeSpan = localStorage.getItem('server_local_timeSpan')
    if (!serverLocalTimeSpan) {
      return now
    }
    return new Date(now - serverLocalTimeSpan)
  }

  // 用冒泡从a-z从小到大排序排序
  sortParams(obj) {
    var arr = []
    var num = 0
    for (let i in obj) {
      arr[num] = `${i}${!isEmpty(obj[i]) ? obj[i] : ''}`
      num++
    }
    let sortArr = getKeySort(arr)
    let sortStr = ''
    sortArr.forEach(item => {
      sortStr += item
    })
    // console.log('obj', obj, 'sortStr', sortStr)
    return sortStr
  }
}
