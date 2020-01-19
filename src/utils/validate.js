/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:|index.php)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 验证电话号码
export function validateMobile(str) {
  const reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
  return reg.test(str)
}
// 验证手机号
export function validatePhone(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}
// 同时校验手机号及电话号
export function validatePhone2(str) {
  const reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^(1[3|4|5|6|7|8|9][0-9]\d{8})$)/
  return reg.test(str)
}
// 验证用户名 中文 英文 数字及下划线_ 长度2-15
export function validateAccount(str) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9\_]{2,15}$/
  return reg.test(str)
}

// 验证密码格式 不能有空格、回车、换行、中文字符
export function validatePassword(str) {
  const reg = /^[^\s\u4e00-\u9fa5]{6,18}$/
  return reg.test(str)
}

// 验证真实姓名 中文 英文 数字
export function validateRealName(str) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9]*$/
  return reg.test(str)
}
