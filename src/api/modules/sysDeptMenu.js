import http from '@/utils/httpRequest'

export function sysDeptMenuSave (params) {
  return http({
    url: '/api/SysDeptMenu/Save',
    method: 'POST',
    data: params
  })
}
