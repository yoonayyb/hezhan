
import http from '@/utils/httpRequest'

export function getUserTreeModel () {
  return http({
    url: http.adornUrl('/api/SysUser/GetUserTreeModel'),
    method: 'GET'
  })
}
