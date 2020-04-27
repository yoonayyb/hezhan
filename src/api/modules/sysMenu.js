import http from '@/utils/httpRequest'
export function getMenuTreeByRole (params) {
  return http({
    url: '/api/SysMenu/getMenuTreeByRole',
    method: 'GET',
    params: params
  })
}

export function getMenuTreeByDept (params) {
  return http({
    url: '/api/SysMenu/getMenuTreeByDept',
    method: 'GET',
    params: params
  })
}

export function getMenuTreeByUser (params) {
  return http({
    url: '/api/SysMenu/getMenuTreeByUser',
    method: 'GET',
    params: params
  })
}
