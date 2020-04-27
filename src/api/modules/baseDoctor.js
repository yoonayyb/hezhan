
import http from '@/utils/httpRequest'

// 医生
export function getDoctorList (params) {
  return http({
    url: '/api/BaseDoctor/Getlist',
    method: 'GET',
    params: params
  })
}
