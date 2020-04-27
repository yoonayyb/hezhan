// 字典
import http from '@/utils/httpRequest'
export function getPathologyApplyList (params) {
  return http({
    url: '/api/PathologyApply/GetMyApplyList',
    method: 'GET',
    params: params
  })
}

export function getPathologyListBase (params) {
  return http({
    url: '/api/PathologyApply/GetListBase',
    method: 'GET',
    params: params
  })
}
export function getPathologyApplyListBase (params) {
  return http({
    url: '/api/PathologyApply/GetSingListBase',
    method: 'GET',
    params: params
  })
}
export function getPathologyApproveListBase (params) {
  return http({
    url: '/api/PathologyApply/GetApproveListBase',
    method: 'GET',
    params: params
  })
}

export function getPathologyApplyModel (id) {
  return http({
    url: '/api/PathologyApply/GetViewModel/' + id,
    method: 'GET'
  })
}
export function savePathologyApply (data) {
  return http({
    url: `/api/PathologyApply/Save`,
    method: 'POST',
    data: data
  })
}

export function savePathologyReport (data) {
  return http({
    url: `/api/PathologyApply/pathologyReport`,
    method: 'POST',
    data: data
  })
}

export function deletePathologyApply (ids) {
  return http({
    url: '/api/PathologyApply/Delete?ids=' + ids,
    method: 'POST'
  })
}
export function deletePathologyFile (ids) {
  return http({
    url: '/api/PathologyFile/Delete?ids=' + ids,
    method: 'POST'
  })
}
export function pathologySing (id) {
  return http({
    url: '/api/PathologyApply/pathologySing/' + id,
    method: 'GET'
  })
}

export function pathologyApprove (id) {
  return http({
    url: '/api/PathologyApply/pathologyApprove/' + id,
    method: 'GET'
  })
}

export function pathologyAnalyse (id) {
  return http({
    url: '/api/PathologyApply/pathologyAnalyse/' + id,
    method: 'GET'
  })
}

// 统计查询
export function PathologyStatistics (params) {
  return http({
    url: '/api/PathologyApply/GetPathologyStatistics',
    method: 'GET',
    params: params
  })
}
