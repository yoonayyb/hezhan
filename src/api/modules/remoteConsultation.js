import http from '@/utils/httpRequest'

export function consultationStatistics (params) {
  return http({
    url: 'api/consapply/GetConsStatistics',
    method: 'GET',
    params: params
  })
}
