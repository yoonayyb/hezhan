import http from '@/utils/httpRequest'
// 统计查询
export function remoteClincStatistics (params) {
  return http({
    url: '/api/OutpSchedulingApply/GetOutSchedulingApplyStatistics',
    method: 'GET',
    params: params
  })
}
