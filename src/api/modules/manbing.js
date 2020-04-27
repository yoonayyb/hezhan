import http from '@/utils/httpRequest'
//获取迭代
export function recordInformation(params) {
  return http({
    url: `/api/Iterate/GetList`,
    method: 'GET',
    params: params
  })
}
//保存迭代
export function addRecordInformation(params) {
  return http({
    url: `/api/Iterate/Save`,
    method: 'POST',
    data: params
  })
}
//获取需求
export function baseInformation(params) {
  return http({
    url: `/api/Demand/GetList`,
    method: 'GET',
    params: params
  })
}
//添加需求
export function addBaseInformation(params) {
  return http({
    url: `/api/Demand/Save`,
    method: 'POST',
    data: params
  })
}
//获取项目信息
export function userInformation(params) {
  return http({
    url: `/api/Project/GetList`,
    method: 'GET',
    params: params
  })
}
//保存项目信息
export function addUserInformation(params) {
  return http({
    url: `/api/Project/Save`,
    method: 'POST',
    data: params
  })
}
//获取项目详情
export function getProjectDetail(params) {
  return http({
    url: `/api/Project/GetDetail`,
    method: 'GET',
    params: params
  })
}
//获取需求详情
export function getDemandDetail(params) {
  return http({
    url: `/api/Demand/GetDetail`,
    method: 'GET',
    params: params
  })
}
//获取迭代详情
export function getIterateDetail(params) {
  return http({
    url: `/api/Iterate/GetDetail`,
    method: 'GET',
    params: params
  })
}
