import http from '@/utils/httpRequest'

export function sysRoleMenuSave (params) {
  return http({
    url: '/api/SysRoleMenu/Save',
    method: 'POST',
    data: (params)
  })
}
