import http from '@/utils/httpRequest'

// 工作流环节新增/修改
export function saveWorkflowLinkUser (data) {
  return http({
    url: `/api/Workflow_Link_User/Save`,
    method: 'POST',
    data: data
  })
}

export function getWorkflowLinkUserViewModel (id) {
  return http({
    url: http.adornUrl('/api/Workflow_Link_User/GetViewModel'),
    method: 'GET',
    params: {ID: id}
  })
}
export function getWorkflowLinkUserList (params) {
  return http({
    url: http.adornUrl('/api/Workflow_Link_User/GetLinkUserList'),
    method: 'GET',
    params: params
  })
}
