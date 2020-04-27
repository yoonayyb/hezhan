import http from './httpRequest'
import qs from 'qs'

/*
 * 获取个人信息
 * */
export function getUserInfo() {
  return http({
    url: '/api/SysUser/CurrentUser',
    method: 'GET'
  })
}
//获取优先级
export function rankList(params = '') {
  return http({
    url: '/api/Dict/GetList',
    method: 'GET',
    params,
  })
}
//获取所有参与者列表
export function getUserList(params = '') {
  return http({
    url: '/api/User/GetList',
    method: 'GET',
    params,
  })
}
//获取某个项目参与者列表
export function getProjectUserList(params = '') {
  return http({
    url: '/api/Project/GetUser',
    method: 'GET',
    params,
  })
}
/*
 * 登录
 * */
export function login(params) {
  return http({
    url: '/api/Login/login',
    method: 'POST',
    data: params
  })
}
export function loginUpdate(params) {
  return http({
    url: '/api/Login/Update',
    method: 'POST',
    data: params
  })
}

// 系统菜单
export function getMenuTree(params = {}) {
  return http({
    url: '/api/SysMenu/getMenuTree',
    method: 'get',
    params
  })
}

export function getMenuTreeByRole(params) {
  return http({
    url: '/api/SysMenu/getMenuTreeByRole',
    method: 'get',
    params
  })
}

export function sysMenuEdit(params) {
  return http({
    url: '/api/SysMenu/GetViewModel',
    method: 'get',
    params
  })
}

export function saveMenuTree(params) {
  return http({
    url: '/api/SysMenu/SaveMenuAuthority',
    method: 'POST',
    data: params
  })
}
export function getSysMenuViewModel(params) {
  return http({
    url: '/api/SysMenu/GetViewModel',
    method: 'GET',
    params
  })
}
export function deleteSysMenu(parmas) {
  return http({
    url: '/api/SysMenu/Delete?ids=' + parmas,
    method: 'POST'
  })
}
// 权限管理 SysRole
export function getSysRolelist(params) {
  return http({
    url: '/api/SysRole/Getlist',
    method: 'GET',
    params: params
  })
}
export function getSysRoleViewModel(params) {
  return http({
    url: '/api/SysRole/GetViewModel',
    method: 'GET',
    params: params
  })
}
export function sysRoleSave(params) {
  return http({
    url: '/api/SysRole/Save',
    method: 'POST',
    data: http.adornParams(params)
  })
}

export function getRoleMenuList(params) {
  return http({
    url: '/api/SysRoleMenu/GetRoleMenuList',
    method: 'GET',
    params: http.adornParams(params)
  })
}

/*
 * 医院(查本院或数据授权的医院)
 * */
export function getOrgList(params) {
  return http({
    url: '/api/BaseOrg/Getlist',
    method: 'GET',
    params: params
  })
}
/*
 * 医院(查本院或医联体内的医院)
 * */
export function getAllianceOrgList(params) {
  return http({
    url: '/api/BaseOrg/GetAllianceListBase',
    method: 'GET',
    params: params
  })
}

// 科室
export function getDept(params) {
  return http({
    url: '/api/BaseDept/Getlist',
    method: 'GET',
    params: params
  })
}
export function getViewModelDept(id, params = {}) {
  return http.get(`/api/BaseDept/GetViewModel/${id}`, http.adornParams(params))
}
// 病人
export function getPatient(params) {
  return http({
    url: '/api/Patient/Getlist',
    method: 'GET',
    params: params
  })
}
export function getPatientLis(params) {
  return http({
    url: '/api/LisReport/GetReportList',
    method: 'GET',
    params: params
  })
}
// export function getPatientPacs (params) {
//   return http({
//     url: '/api/PacsReport/GetInfoPacsReprotList',
//     method: 'GET',
//     params: params
//   })
// }
export function getPatientPacs(params) {
  return http({
    url: '/api/PacsReport/GetInfoPacsReprotViewList',
    method: 'GET',
    params: params
  })
}
export function getLisReportList(params) {
  return http({
    url: '/api/PatientLis/GetReportList',
    method: 'GET',
    params: params
  })
}
// export function getPacsReportList (params) {
//   return http({
//     url: http.adornUrl('/api/PacsReport/GetInfoPacsReportContent'),
//     method: 'GET',
//     params: params
//   })
// }
export function getPacsReportList(params) {
  return http({
    url: http.adornUrl('/api/PacsReport/GetInfoPacsReportContentView'),
    method: 'GET',
    params: params
  })
}
export function getPatientRecord(params) {
  return http({
    url: '/api/EmrPatient/GetEmrPatientVMpid',
    method: 'GET',
    params: params
  })
}

/*
 * 医生
 * */
export function getDoctorList(params) {
  return http({
    url: '/api/BaseDoctor/Getlist',
    method: 'GET',
    params: params
  })
}

export function getDoctorForAccountList(params) {
  return http({
    url: '/api/BaseDoctor/GetlistForAccount',
    method: 'GET',
    params: params
  })
}

/*
 * 设备管理
 * */
export function getOrgDevicelist(params) {
  return http({
    url: '/api/OrgDevice/Getlist',
    method: 'GET',
    params: params
  })
}
export function getOrgDeviceViewModel(id, params) {
  return http({
    url: '/api/OrgDevice/GetViewModel/' + id,
    method: 'GET',
    params: params
  })
}
export function saveOrgDevice(params) {
  return http({
    url: '/api/OrgDevice/Save',
    method: 'POST',
    data: params
  })
}
export function deleteOrgDevice(ids) {
  return http({
    url: '/api/OrgDevice/Delete?ids=' + ids,
    method: 'POST'
  })
}

/*
 * 场地管理
 * */
export function getOrgFieldlist(params) {
  return http({
    url: 'api/OrgField/Getlist',
    method: 'GET',
    params: params
  })
}
export function getOrgFieldViewModel(id, params) {
  return http({
    url: '/api/OrgField/GetViewModel/' + id,
    method: 'GET',
    params: params
  })
}
export function saveOrgField(params) {
  return http({
    url: '/api/OrgField/Save',
    method: 'POST',
    data: params
  })
}
export function deleteOrgField(ids) {
  return http({
    url: '/api/OrgField/Delete?ids=' + ids,
    method: 'POST'
  })
}

/*
 *部门权限
 * */
export function getSysDeptMenuList(params) {
  return http({
    url: '/api/SysDeptMenu/Getlist',
    method: 'GET',
    params: params
  })
}
export function getSysDeptGetViewModel(id) {
  return http({
    url: `/api/SysDeptMenu/GetViewModel/${id}`,
    method: 'GET'
  })
}

export function sysDeptMenuGetPermissionList(params) {
  return http({
    url: `api/SysDeptMenu/GetPermissionList`,
    method: 'GET',
    params: params
  })
}
// 保存
export function SaveSysDeptMenu(parmas) {
  return http({
    url: `api/SysDeptMenu/Save`,
    method: 'POST',
    data: parmas
  })
}
export function sysDeptMenu_delete() {
  return http({
    url: '/api/OrgDevice/Delete?ids=' + ids,
    method: 'POST'
  })
}

/*
 * 用户角色
 * */
/// api/SysUersRole/Getlist
export function get_sysUersRolelist(params) {
  return http({
    url: '/api/SysUersRole/Getlist',
    method: 'GET',
    params: params
  })
}
export function sysUersRole_GetAccountlist(params) {
  return http({
    url: '/api/SysUersRole/GetAccountlist',
    method: 'GET',
    params: params
  })
}
export function sysUersRole_GetRolelist(params) {
  return http({
    url: '/api/SysUersRole/GetRolelist',
    method: 'GET',
    params: params
  })
}
export function sysUersRole_GetViewModel(id) {
  return http({
    url: '/api/SysUersRole/GetViewModel/' + id,
    method: 'GET'
  })
}

export function sysUersRole_Save(params) {
  return http({
    url: '/api/SysUersRole/Save',
    method: 'POST',
    data: params
  })
}

/*
 * 转诊
 * */
export function TransferProcedure_save(params) {
  return http({
    url: '/api/TransferProcedure/Save',
    method: 'POST',
    data: params
  })
}
/// api/TransferApply/GetlistMyApply
export function TransferApply_GetlistMyApply(params) {
  return http({
    url: '/api/TransferApply/GetlistMyApply',
    method: 'GET',
    params: params
  })
}

/* 远程会诊
 * */
export function ConsultationApply_GetViewModel(id) {
  return http({
    url: '/api/ConsApply/GetViewModel/' + id,
    method: 'GET'
  })
}
export function ConsultationApply_Save(params) {
  return http({
    utl: '/api/ConsultationApply/Save',
    method: 'POST',
    data: params
  })
}
export function ConsultationApply_Getlist(params) {
  return http({
    url: '/api/ConsApply/GetMyApplylist',
    method: 'GET',
    params: params
  })
}
export function ConsultationReport(params) {
  return http({
    url: '/api/Patient/ConsultationReport',
    method: 'GET',
    params: params
  })
}

export function getBaseDict(id) {
  return http({
    url: '/api/BaseDict/GetlistByType',
    method: 'GET',
    params: {
      typeid: id
    }
  })
}

/*
 * 系统操作日志
 * */
export function GetSysOptLogsList(params) {
  return http({
    url: '/api/SysOperatorLogs/GetList',
    method: 'GET',
    params: params
  })
}

// 获取病历列表
// 入院记录列表
export function getRecordInGetlist(params) {
  return http({
    url: '/api/MedicalRecord/RecordInGetlist',
    method: 'GET',
    params: params
  })
}

export function getEmrFile(params) {
  return http({
    url: '/api/EmrFile/Getlist',
    method: 'GET',
    params: params
  })
}

export function getEmrFileByApplyId(params) {
  return http({
    url: '/api/Emrfile/GetlistByApply',
    method: 'GET',
    params: params
  })
}

export function getEmrFileDeteil(params) {
  return http({
    url: '/api/PatientIndex/Getxml',
    method: 'GET',
    params: params
  })
}

/*
 * 会诊排班
 * */
export function getCONSULTATION_SCHEDULINGList(params) {
  return http({
    url: '/api/ConsScheduling/Getlist',
    method: 'GET',
    params: params
  })
}

// 门诊排班
export function getOutpSchedulingControllerList(params) {
  return http({
    url: '/api/OutpScheduling/Getlist',
    method: 'GET',
    params: params
  })
}

export function getlis_pacs_SCHEDULINGList(params) {
  return http({
    url: '/api/LisPcsScheduling/Getlist',
    method: 'GET',
    params: params
  })
}
