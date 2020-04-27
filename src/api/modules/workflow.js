import http from '@/utils/httpRequest'

// 查询工作流列表信息
export function getWorkflowList (params) {
  return http({
    url: http.adornUrl('/api/Workflow/Getlist'),
    method: 'GET',
    params: params
  })
}
// 按ID查询工作流详情
export function getWorkflowViewModel (id) {
  return http({
    url: '/api/Workflow/GetViewModel',
    method: 'GET',
    params: { ID: id }
  })
}
// 工作流新增/修改
export function saveWorkflow (linkList, data) {
  return http({
    url: `/api/Workflow/Save?LinkList=` + linkList,
    method: 'POST',
    data: data
  })
}
// 工作流新增带环节参数，不支持修改
export function saveWorkflowAddNew (linkList, data) {
  return http({
    url: `/api/Workflow/AddSave?LinkList=` + linkList,
    method: 'POST',
    data: data
  })
}
