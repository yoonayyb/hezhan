import http from '@/utils/httpRequest'

export function getPatient (params) {
  return http({
    url: http.adornUrl('/api/Patient/Getlist'),
    method: 'GET',
    params: params
  })
}
const baseUrl = 'http://222.217.61.114:8081/api'
export function getHisPatient (params) {
  return http({
    url: baseUrl + '/Patient/GetList',
    method: 'GET',
    params: params
  })
}

export function getBasePatient (params) {
  return http({
    url: '/api/emrpatient/GetEmrPatientLast',
    method: 'GET',
    params: params
  })
}

export function uploadCheckReport (params) {
  return http({
    url: '/api/PacsReport/Save',
    method: 'POST',
    data: params
  })
}

export function uploadLisReport (params) {
  return http({
    url: '/api/LisReport/Save',
    method: 'POST',
    data: params
  })
}

export function uploadEmrFile (params) {
  return http({
    url: '/api/EmrFile/Save',
    method: 'POST',
    data: params
  })
}

export function getPacsReportList (params) {
  return http({
    url: '/api/PacsReport/Getlist',
    method: 'GET',
    params: params
  })
}

export function getPacsReportListById (params) {
  return http({
    url: '/api/PacsReport/GetlistByApply',
    method: 'GET',
    params: params
  })
}

// 业务（转诊、会诊）补充材料展示接口
export function getListByApply (params) {
  return http({
    url: '/api/PatientRelation/GetlistByApply',
    method: 'GET',
    params: params
  })
}

// 业务（转诊、会诊）补充材料提交保存接口
export function saveListByApply (params) {
  return http({
    url: '/api/PatientRelation/save',
    method: 'POST',
    data: params
  })
}

export function getPacsReportItem (params) {
  return http({
    url: '/api/PacsReport/GetViewModelData',
    method: 'GET',
    params: params
  })
}

export function getExamReportList (params) {
  return http({
    url: '/api/LisReport/Getlist',
    method: 'GET',
    params: params
  })
}

export function getExamReportListByApplyId (params) {
  return http({
    url: '/api/LisReport/GetlistByApply',
    method: 'GET',
    params: params
  })
}

export function getPatientRelationList (params) {
  return http({
    url: '/api/patientRelation/GetTypelist',
    method: 'GET',
    params: params
  })
}

// 通过申请单号拿病历文件
export function getListEmrByApply (params) {
  return http({
    url: '/api/patientRelation/GetListEmrByApply',
    method: 'GET',
    params: params
  })
}

// 通过申请单号拿检验文件
export function getListLisByApply (params) {
  return http({
    url: '/api/patientRelation/GetListLisByApply',
    method: 'GET',
    params: params
  })
}

// 通过申请单号拿检查文件
export function getListPacsByApply (params) {
  return http({
    url: '/api/patientRelation/GetListPacsByApply',
    method: 'GET',
    params: params
  })
}

// 拿远程门诊药品列表
export function getDrug (params) {
  return http({
    url: '/api/RemoteClinicDrugsBase/GetManageList',
    method: 'GET',
    params: params
  })
}
