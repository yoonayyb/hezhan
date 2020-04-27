import http from '@/utils/httpRequest'

// 按ID查询工作流详情
export function getWorkflowLinkList (id) {
  return http({
    url: http.adornUrl('/api/Workflow_Link/GetLinkList'),
    method: 'GET',
    params: { work_flow_id: id }
  })
}

export function getWorkflowLinkViewModel (id) {
  return http({
    url: '/api/Workflow_Link/GetViewModel',
    method: 'GET',
    params: { ID: id }
  })
}
// 环节前移
export function workflowLinkFlowMoveUpStep (params) {
  return http({
    url: http.adornUrl('/api/Workflow_Link/FlowMoveUpStep'),
    method: 'GET',
    params: params
  })
}
// 环节后移
export function workflowLinkFlowMoveDownStep (params) {
  return http({
    url: http.adornUrl('/api/Workflow_Link/FlowMoveDownStep'),
    method: 'GET',
    params: params
  })
}

export function saveWorkflowLink (data) {
  return http({
    url: `/api/Workflow_Link/Save`,
    method: 'POST',
    data: data
  })
}
export function workflowLinkGetUserTreeModel (id) {
  return http({
    url: '/api/Workflow_Link/GetUserTreeModel',
    method: 'GET',
    params: {
      Workflow_link_id: id
    }
  })
}

export function workflowLinkGetRoleList (id) {
  return http({
    url: '/api/Workflow_Link/GetRoleList',
    method: 'GET',
    params: {
      Workflow_link_id: id
    }
  })
}
export function getWorkflowAllLinkStep (params) {
  return http({
    url: '/api/Workflow_Link/GetAllLinkStep',
    method: 'GET',
    params: params
  })
}

export function getWorkflowViewModeldocID (params) {
  return http({
    url: '/api/Workflow_Apply/GetViewModeldocID',
    method: 'GET',
    params: params
  })
}
