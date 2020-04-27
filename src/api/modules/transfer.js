import http from '@/utils/httpRequest'

export function transferStatistics (params) {
  return http({
    url: '/api/TransferApply/GetTransferStatistics',
    method: 'GET',
    params: params
  })
}
