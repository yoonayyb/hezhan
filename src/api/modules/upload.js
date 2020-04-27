import http from '@/utils/httpRequest'

export function loadFileByBizTypeId (id) {
  return http({
    url: `/api/Upload/LoadFileByBizTypeId/${id}`,
    method: 'GET'
  })
}
export function upload (file) {
  return http({
    url: '/api/Upload/UploadFile',
    method: 'post',
    data: file
  })
}
export function uploadFile (file) {
  return http({
    url: '/api/Upload/UploadChronicImport',
    method: 'post',
    data: file
  })
}
export function postFiles (formData, fn) {
  return http({
    url: '/api/Upload/UploadFile',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: function (progressEvent) {
      if (progressEvent.total !== 0) {
        let i = progressEvent.loaded / progressEvent.total * 100
        i = Math.round(i)
        fn(i)
      }
      // 对原生进度事件的处理
    }
  })
}
