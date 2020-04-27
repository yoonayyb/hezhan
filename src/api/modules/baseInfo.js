import http from '@/utils/httpRequest'

export function getUserInfo () {
  return http({
    url: http.adornUrl('/api/SysUser/CurrentUser'),
    method: 'GET'
  })
}
