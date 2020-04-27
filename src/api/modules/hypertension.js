import http from '@/utils/httpRequest'
//高血压基础信息
export function hypertensionBase(params) {
  return http({
    url: `/api/hypertensionBase/pcgetlist`,
    method: 'GET',
    params: params
  })
}
//修改、保存高血压基础信息
export function saveHypertensionBase(params) {
  return http({
    url: `/api/hypertensionBase/pcSave`,
    method: 'POST',
    data: params
  })
}
//血压记录信息列表
export function hypertensionRecord(params) {
  return http({
    url: `/api/bloodPressureInfo/pcGetlist`,
    method: 'GET',
    params: params
  })
}
//修改、保存血压记录信息列表
export function saveHypertensionRecord(params) {
  return http({
    url: `/api/bloodPressureInfo/pcSave`,
    method: 'POST',
    data: params
  })
}
//体质指数记录信息列表
export function constitutionInfo(params) {
  return http({
    url: `/api/constitutionInfo/pcgetlist`,
    method: 'GET',
    params: params
  })
}
//修改、保存体质指数记录信息列表
export function saveConstitutionInfo(params) {
  return http({
    url: `/api/constitutionInfo/pcSave`,
    method: 'POST',
    data: params
  })
}
//糖化血红蛋白信息列表
export function glycatedInfo(params) {
  return http({
    url: `/api/GlycatedInfo/pcGetlist`,
    method: 'GET',
    params: params
  })
}
//修改、保存糖化血红蛋白信息列表
export function saveGlycatedInfo(params) {
  return http({
    url: `/api/GlycatedInfo/pcsave`,
    method: 'POST',
    data: params
  })
}
