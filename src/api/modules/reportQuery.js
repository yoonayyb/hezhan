import http from '@/utils/httpRequest'
// 门诊机构查询
export function remoteClincOrgQuery (params) {
  return http({
    url: '/api/OutpatientApply/GetStatisticsOrg',
    method: 'GET',
    params: params
  })
}
// 门诊科室查询
export function remoteClincdeptQuery (params) {
  return http({
    url: '/api/OutpatientApply/GetStatisticsDept',
    method: 'GET',
    params: params
  })
}
// 门诊个人查询
export function remoteClincpersonQuery (params) {
  return http({
    url: '/api/OutpatientApply/GetStatisticsDoctor',
    method: 'GET',
    params: params
  })
}
// 门诊报告明细
export function clincReportDetail (params) {
  return http({
    url: '/api/OutpatientApply/GetStatisticsDetailList',
    method: 'GET',
    params: params
  })
}
// 门诊明细详情
export function getStatisticsDetail (params) {
  return http({
    url: `/api/OutpatientApply/GetStatisticsDetail?applyId=${params}`,
    method: 'GET'
  })
}
// 会诊报告明细
export function consReportDetail (params) {
  return http({
    url: '/api/consapply/GetListReportForms',
    method: 'GET',
    params: params
  })
}
// 会诊明细详情
export function getReportFormsView (params) {
  return http({
    url: `/api/consapply/GetReportFormsView?thisId=${params}`,
    method: 'GET'
  })
}
// 会诊机构查询
export function remoteConsultationOrgQuery (params) {
  return http({
    url: '/api/consApply/getConsStatisticsOrg',
    method: 'GET',
    params: params
  })
}
// 会诊科室查询
export function remoteConsultationdeptQuery (params) {
  return http({
    url: '/api/consApply/getConsStatisticsDept',
    method: 'GET',
    params: params
  })
}

// 会诊个人查询
export function remoteConsultationpersonQuery (params) {
  return http({
    url: '/api/consApply/getConsStatisticsDoctor',
    method: 'GET',
    params: params
  })
}
// 影像机构查询
export function remotePacsOrgQuery (params) {
  return http({
    url: '/api/pacsApply/getPacsStatisticsOrg',
    method: 'GET',
    params: params
  })
}
// 影响科室查询
export function remotePacsdeptQuery (params) {
  return http({
    url: '/api/pacsApply/getPacsStatisticsDept',
    method: 'GET',
    params: params
  })
}
// 影像个人查询
export function remotePacspersonQuery (params) {
  return http({
    url: '/api/pacsApply/getPacsStatisticsDoctor',
    method: 'GET',
    params: params
  })
}
// 影像报告明细
export function remoteGetListRrportForms (params) {
  return http({
    url: `/api/pacsApply/GetListReportForms`,
    method: 'GET',
    params: params
  })
}
// 影像报告详情
export function remoteGetReportFormsView (params) {
  return http({
    url: `/api/pacsApply/GetReportFormsView?thisid=${params}`,
    method: 'GET'
  })
}
