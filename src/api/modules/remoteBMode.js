import http from '@/utils/httpRequest'

export function bModeStatistics (params) {
  return http({
    url: 'api/consapply/GetConsBStatistics',
    method: 'GET',
    params: params
  })
}
