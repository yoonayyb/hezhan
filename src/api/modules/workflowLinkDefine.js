
import http from '@/utils/httpRequest'

// 工作流环节定义信息列表
export function getWorkflowLinkDefineList (params) {
  return http({
    url: http.adornUrl('/api/Workflow_Link_Define/Getlist'),
    method: 'GET',
    params: params
  })
}
// 工作流环节定义信息
export function getWorkflowLinkDefineViewModel (id) {
  return http({
    url: http.adornUrl('/api/Workflow_Link_Define/GetViewModel'),
    method: 'GET',
    params: {ID: id}
  })
}
// 工作流环节新增/修改
export function saveWorkflowLinkDefine (data) {
  return http({
    url: `/api/Workflow_Link_Define/Save`,
    method: 'POST',
    data: data
  })
}
