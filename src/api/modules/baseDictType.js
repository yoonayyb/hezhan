// 字典分类
import http from './httpRequest'
export function getDictTypeList (params) {
  return http({
    url: http.adornUrl('/api/baseDictType/Getlist'),
    method: 'GET',
    params: params
  })
}
export function getDeptViewModel (params) {
  return http({
    url: http.adornUrl('/api/BaseDept/Getlist'),
    method: 'GET',
    params: params
  })
}
export function saveDept (data) {
  return http({
    url: `/api/BaseDept/Save`,
    method: 'POST',
    data: data
  })
}
export function deleteDept (ids) {
  return http({
    url: '/api/BaseDept/Delete?ids=' + ids,
    method: 'POST'
  })
}
