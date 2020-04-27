import http from '@/utils/httpRequest'
export function getFirstRecordModel (id) {
  return http({
    url: `/api/FirstRecord/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getEmrCourseRecordModel (id) {
  return http({
    url: `/api/EmrCourseRecord/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getEmrWarddModel (id) {
  return http({
    url: `/api/EmrWard/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}
export function getEmrDailydModel (id) {
  return http({
    url: `/api/EmrDaily/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getPatientProgress (params) {
  return http({
    url: `/api/patientProgress/GetlistAll`,
    method: 'GET',
    params: params
  })
}

export function getPatientProgressFromBus (params) {
  return http({
    url: `/api/PatientProgress/GetlistAllByBusiness`,
    method: 'GET',
    params: params
  })
}

export function getPatientProgressFromDetail (params) {
  return http({
    url: `/api/PatientProgress/GetListPatientByApply`,
    method: 'GET',
    params: params
  })
}

export function getRecordIn (id) {
  return http({
    url: `/api/RecordIn/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordOut (id) {
  return http({
    url: `/api/RecordOut/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getEmrRescue (id) {
  return http({
    url: `/api/EmrRescue/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getEmrOp (id) {
  return http({
    url: `/api/EmrOp/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getEmPostOperative (id) {
  return http({
    url: `/api/EmrPostoperative/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordSummary (id) {
  return http({
    url: `/api/RecordSummary/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordOdituary (id) {
  return http({
    url: `/api/RecordOdituary/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordDiscussion (id) {
  return http({
    url: `/api/RecordDiscussion/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecodePs (id) {
  return http({
    url: `/api/RecodePs/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordRopd (id) {
  return http({
    url: `/api/RecordRopd/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordOperation (id) {
  return http({
    url: `/api/RecordOperation/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordNursing (id) {
  return http({
    url: `/api/RecordNursing/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordOd (id) {
  return http({
    url: `/api/RecordOd/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getRecordDisDie (id) {
  return http({
    url: `/api/RecordDisDie/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}

export function getEmrCon (id) {
  return http({
    url: `/api/EmrCon/GetViewModel/`,
    method: 'GET',
    params: {
      emrID: id
    }
  })
}
