import http from '@/utils/httpRequest'
export function savePacsReport (vmodel) {
  return http({
    url: '/api/ConsApply/UpdatePacsReport',
    method: 'POST',
    data: vmodel
  })
}
