// 院内
const inHosp = [
  '5cb4ff0c-69bb-4235-b582-1d1222ea4ed0',
  '1361e288-3620-41bc-885e-60828d86b0e0'
]
// 院外
const outHosp = [
  'df9c0957-d7f3-4e57-912a-f38f41e70408',
  '3f32de35-bf63-479d-92a8-b0402df4663c'
]
// 平诊
const IsEmergencyArr = [
  '1361e288-3620-41bc-885e-60828d86b0e0',
  'df9c0957-d7f3-4e57-912a-f38f41e70408'
]
// 急诊
const emergencyArr = [
  '3f32de35-bf63-479d-92a8-b0402df4663c',
  '5cb4ff0c-69bb-4235-b582-1d1222ea4ed0'
]

export function isInHosp (typeId) {
  return inHosp.includes(typeId)
}

export function isOutHosp (typeId) {
  return outHosp.includes(typeId)
}
