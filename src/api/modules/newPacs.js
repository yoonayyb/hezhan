import http from '@/utils/httpRequest'
export function getPacsApplyApplyList(params) {
  return http({
    url: '/api/PacsApply/GetMyApplyList',
    method: 'GET',
    params: params
  })
}

export function getPacsApproveList(params) {
  return http({
    url: '/api/PacsApply/GetApproveListBase',
    method: 'GET',
    params: params
  })
}

export function getPacsRecordList(params) {
  return http({
    url: '/api/PacsApply/GetListBase',
    method: 'GET',
    params: params
  })
}
export function getPacsRecordListOrg(params) {
  return http({
    url: '/api/PacsApply/GetListBaseOrg',
    method: 'GET',
    params: params
  })
}
export function getPacsWaitList(params) {
  return http({
    url: '/api/PacsApply/GetSingListBase',
    method: 'GET',
    params: params
  })
}

export function pacsSing(id) {
  return http({
    url: '/api/PacsApply/pathologySing/' + id,
    method: 'GET'
  })
}

export function pacsApprove(id) {
  return http({
    url: '/api/PacsApply/pathologyApprove/' + id,
    method: 'GET'
  })
}

export function pacsAnalyse(id) {
  return http({
    url: '/api/PacsApply/pathologyAnalyse/' + id,
    method: 'GET'
  })
}

export function getPacsApplyModel(id) {
  return http({
    url: `/api/PacsApply/GetViewModel/${id}`,
    method: 'GET'

  })
}

export function savePacsApply(data) {
  return http({
    url: `/api/PacsApply/Save`,
    method: 'POST',
    data: data
  })
}

export function savePacsReport(data) {
  return http({
    url: `/api/PacsApply/pathologyReport`,
    method: 'POST',
    data: data
  })
}

export function deletePacsApply(ids) {
  return http({
    url: '/api/PacsApply/Delete?ids=' + ids,
    method: 'POST'
  })
}

export function deletePacsFile(ids) {
  return http({
    url: '/api/PacsFile/Delete?ids=' + ids,
    method: 'POST'
  })
}

// 统计查询
export function PacsStatistics(params) {
  return http({
    url: '/api/PacsApply/GetPacsStatistics',
    method: 'GET',
    params: params
  })
}

// 会诊影像报告
export function PacsReportGetViewModel(_applyId) {
  return http({
    url: '/api/ConsPacsReport/GetViewModel/0',
    method: 'GET',
    params: {
      applyid: _applyId
    }
  })
}
// 手动会诊影像报告
export function PacsReportaGet(_applyId) {
  return http({
    url: '/api/PacsReportA/GetViewModel/0',
    method: 'GET',
    params: {
      applyid: _applyId
    }
  })
}
// 会诊影像报告
export function PacsReportGetView(_applyId) {
  return http({
    url: '/api/ConsPacsReport/GetReportView',
    method: 'GET',
    params: {
      applyid: _applyId
    }
  })
}

export function savePacsConReport(data) {
  return http({
    url: `/api/ConsPacsReport/Save`,
    method: 'POST',
    data: data
  })
}
// 影像提交保存
export function savePacsConReporta(data) {
  return http({
    url: `/api/PacsReportA/Save`,
    method: 'POST',
    data: data
  })
}
