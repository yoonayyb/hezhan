import http from '@/utils/httpRequest'

// 修改密码
export function saveSysdataauthorize (params) {
  return http({
    url: `/api/Sysdataauthorize/Save`,
    method: 'post',
    data:params
  })
}
export function getSysdataauthorizeList (params) {
    return http({
      url: `/api/Sysdataauthorize/Getlist`,
      method: 'get',
      params:params
    })
  }