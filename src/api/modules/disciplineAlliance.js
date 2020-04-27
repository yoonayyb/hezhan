import http from '@/utils/httpRequest'

// 板块管理
export function getPlateList (params) {
  return http({
    url: '/api/BBSClass/Getlist',
    method: 'GET',
    params: params
  })
}

export function getPlateListItem (params) {
  return http({
    url: '/api/BBSClass/GetViewModel/' + params,
    method: 'GET'
  })
}

export function plateSave (params) {
  return http({
    url: '/api/BBSClass/Save',
    method: 'POST',
    data: params
  })
}

export function plateDelete (params) {
  return http({
    url: '/api/BBSClass/Delete?ids=' + params,
    method: 'POST'
  })
}

// 帖子管理
export function getPostList (params) {
  return http({
    url: '/api/BBSTopic/GetMclist',
    method: 'GET',
    params: params
  })
}

export function getPostItem (params) {
  return http({
    url: '/api/BBSTopic/GetViewModel/' + params,
    method: 'GET'
  })
}

export function getPostListItem (params) {
  return http({
    url: '/api/BBSTopic/GetViewModel',
    method: 'GET',
    params: params
  })
}

export function addViewCount (params) {
  return http({
    url: '/api/BBSTopic/ApproveStatus',
    method: 'GET',
    params: params
  })
}

export function postApproval (params) {
  return http({
    url: '/api/BBSTopic/ApproveStatus',
    method: 'GET',
    params: params
  })
}

export function postRecommend (params) {
  return http({
    url: '/api/BBSTopic/Recommend',
    method: 'GET',
    params: params
  })
}

export function postSave (params) {
  return http({
    url: '/api/BBSTopic/Save',
    method: 'POST',
    data: params
  })
}

export function postDelete (params) {
  return http({
    url: '/api/BBSTopic/Delete?ids=' + params,
    method: 'POST'
  })
}

// 回复记录管理
export function replyList (params) {
  return http({
    url: '/api/BBSReply/Getlist',
    method: 'GET',
    params: params
  })
}

export function replyListItem (params) {
  return http({
    url: '/api/BBSReply/GetViewModel/' + params,
    method: 'GET'
  })
}

export function replyApproval (params) {
  return http({
    url: '/api/BBSReply/ApproveStatus',
    method: 'GET',
    params: params
  })
}

export function replySave (params) {
  return http({
    url: '/api/BBSReply/Save',
    method: 'POST',
    data: params
  })
}

export function replyDelete (params) {
  return http({
    url: '/api/BBSReply/Delete?ids=' + params,
    method: 'POST'
  })
}

// 举报管理
export function reportList (params) {
  return http({
    url: '/api/BBSReport/GetListBase',
    method: 'GET',
    params: params
  })
}
