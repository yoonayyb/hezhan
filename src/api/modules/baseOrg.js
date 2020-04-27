import http from '@/utils/httpRequest'
// 加了权限的列表
export function getOrgList (params) {
  return http({
    url: '/api/BaseOrg/Getlist',
    method: 'GET',
    params: params
  })
}
//获取详情
export function getOrgViewModel (params) {
  return http({
    url: '/api/baseOrg/GetViewModel',
    method: 'GET',
    params: params
  })
}
// 获取全部列表
export function getOrgListBase (params) {
  return http({
    url: '/api/BaseOrg/GetListBase',
    method: 'GET',
    params: params
  })
}
// 排除自己医院的列表
export function getOrgListNoOwm (params) {
  return http({
    url: '/api/BaseOrg/GetListNoOwm',
    method: 'GET',
    params: params
  })
}
// 排除某一家医院的列表
export function getOrgListOutThis (params) {
  return http({
    url: '/api/BaseOrg/GetListOutThis',
    method: 'GET',
    params: params
  })
}
