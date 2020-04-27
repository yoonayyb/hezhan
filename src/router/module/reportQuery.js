const _import = require('../import-' + process.env.NODE_ENV)

export default {
  dynamic: {
    remoteClinicOrgReport: _import('reportQuery/remoteClinicReport/orgReport/index'), // 门诊医院
    remoteClinicDeptReport: _import('reportQuery/remoteClinicReport/deptReport/index'), // 门诊科室
    remoteClinicPersonReport: _import('reportQuery/remoteClinicReport/personReport/index'), // 门诊个人
    remoteConsultationOrgReport: _import('reportQuery/remoteConsultationReport/orgReport/index'), // 会诊医院
    remoteConsultationDeptReport: _import('reportQuery/remoteConsultationReport/deptReport/index'), // 会诊科室
    remoteConsultationPersonReport: _import('reportQuery/remoteConsultationReport/personReport/index'), // 会诊个人
    remotePacsOrgReport: _import('reportQuery/remotePacsReport/orgReport/index'), // 影像医院统计
    remotePacsDeptReport: _import('reportQuery/remotePacsReport/deptReport/index'), // 影像科室统计
    remotePacsPersonReport: _import('reportQuery/remotePacsReport/personReport/index') // 影像个人统计
  },
  static: []
}
