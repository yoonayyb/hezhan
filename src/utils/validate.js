/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  )
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^1(3|4|5|7|8|9)\d{9}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 *身份证号
 *
 * @export
 * @param {*} s
 * @returns
 */
export function isIdCard(s) {
  return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[X|x])$/.test(
    s
  )
}
export function getBirthdayFromIdCard(idCard) {
  var birthday = ""
  if (idCard != null && idCard != "") {
    if (idCard.length == 15) {
      birthday = "19" + idCard.substr(6, 6);
    } else if (idCard.length == 18) {
      birthday = idCard.substr(6, 8);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
  }
  return birthday
}
export function getSex(idCard) {
  var sexStr = '';
  if (!idCard) {
    return sexStr
  }
  if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
    sexStr = '男';
  } else {
    sexStr = '女';
  }
  return sexStr;
}
