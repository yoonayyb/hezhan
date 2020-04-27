// 字典
import http from '@/utils/httpRequest'
export function getDeptList (params) {
  return http({
    url: http.adornUrl('/api/BaseDept/Getlist'),
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

export function getDeptListByUnitFlag (params) {
  return http({
    url: '/api/BaseDept/GetListByUnitFlag',
    method: 'GET',
    params: params
  })
}
// 获取医生名字
export function getDoctorName (params) {
  return http({
    url: '/api/BaseDoctor/Getlist',
    method: 'GET',
    params: params
  })
}
