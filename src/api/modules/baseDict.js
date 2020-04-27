// 字典
import http from '@/utils/httpRequest'

export function getBaseDict (id) {
  const Id = id.trim()
  return http({
    url: '/api/BaseDict/GetlistByType',
    method: 'GET',
    params: {
      typeid: Id
    }
  })
}
// 婚姻状况
export function getMarriageDict () {
  return getBaseDict('66635010-957B-4C3E-B2B8-2253F0C4BEA4')
}
// 民族名称
export function getNationDict () {
  return getBaseDict('195656fd-eec3-41dd-ba23-4086b8c84985')
}
// 文化程度名称
export function getCultureDict () {
  return getBaseDict('013D590F-1BF3-4B61-B8A6-0C6C7F153F22')
}
// 职业名称
export function getOccupationDict () {
  return getBaseDict('4696FA80-2BB1-4F64-8F68-AC81B3573A6E')
}
// RH血型名称
export function getRHBloodDict () {
  return getBaseDict('F6EF7C31-E929-4D8A-80CB-203DB158A5AD')
}
export function getOrgDict () {
  return getBaseDict('')
}
// 医保类型
export function getMedicalInsuranceDict () {
  return getBaseDict('A2556A85-A9A8-4EB6-8CD1-747C9B517E86')
}
// 血型
export function getBloodDict () {
  return getBaseDict('39C889D0-663A-45E3-ABCB-5E6E5312A855')
}
// 国籍
export function getNationalityDict () {
  return getBaseDict('516B676B-6610-4A6C-BDFD-5545AAFC4E4E')
}
export function getMedicalRecordDict () {
  return getBaseDict('c97ac0b9-a050-4dad-a92f-735c8833f43f')
}
// 性别
export function getGenderDict () {
  return getBaseDict('7d5b35bb-2e62-459e-b10a-016b74d197bc')
}
