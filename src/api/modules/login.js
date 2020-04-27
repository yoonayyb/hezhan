import http from '@/utils/httpRequest'

// 修改密码
export function loginUpdatePwd (params) {
  return http({
    url: `/api/Login/UpdatePwd?oldpwd=${params.oldpwd}&newPwd=${params.newPwd}`,
    method: 'post'
  })
}

export function updateImgPath (data) {
  return http({
    url: `/api/Login/updateImgPath`,
    method: 'POST',
    data: data
  })
}
/*
* 获取个人信息
* */
export function getUserInfo () {
  return http({
    url: '/api/SysUser/CurrentUser',
    method: 'GET'
  })
}
