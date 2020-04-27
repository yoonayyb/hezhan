import http from '@/utils/httpRequest'
export function getSysRoleListView (params) {
  return http({
    url: '/api/SysRole/GetListView',
    method: 'GET',
    params: params
  })
}
export function getSysRolelist (params) {
  return http({
    url: '/api/SysRole/Getlist',
    method: 'GET',
    params: params
  })
}
