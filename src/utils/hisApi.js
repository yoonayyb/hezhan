import http from './httpRequest'

const baseUrl = 'http://222.217.61.114:8081/api'

// 病人
export function Patient_GetList (params) {
  return http({
    url: baseUrl + '/Patient/GetList',
    method: 'GET',
    params: params
  })
}

// 检验
export function getLisList (params) {
  return http({
    url: baseUrl + '/Lis/GetList',
    method: 'GET',
    params: params
  })
}
export function getLisReportList (params) {
  return http({
    url: baseUrl + '/Lis/GetReportList',
    method: 'GET',
    params: params
  })
}

// 检查
export function getPacsList (params) {
  return http({
    url: baseUrl + '/Pacs/GetList',
    method: 'GET',
    params: params
  })
}
export function getPacsReportList (params) {
  return http({
    url: baseUrl + '/Pacs/GetReportList',
    method: 'GET',
    params: params
  })
}
// 医嘱
export function getPatientOrderSinglet (params) {
  return http({
    url: baseUrl + '/PatientOrder/GetSingle',
    method: 'get',
    params: params
  })
}
