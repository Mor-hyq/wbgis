import Cookies from 'js-cookie'
const TokenKey = 'csrftoken'
// 用户信息
const UserInfo = 'userInfo'

const isLogin = 'gis___session'

export function getCSRFToken() {
  return localStorage.getItem(TokenKey)
}

export function setCSRFToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeCSRFToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUserInfo() {
  const info = Cookies.get(UserInfo) ? JSON.parse(Cookies.get(UserInfo)) : ''
  return info
}

export function setUserInfo(data) {
  Cookies.set(UserInfo, JSON.stringify(data), { expires: 1 })
}
export function removeUserInfo() {
  Cookies.remove(UserInfo)
}

export function getLoginStatus() {
  return Cookies.get(isLogin)
}
export function removeLoginStatus() {
  Cookies.remove(isLogin)
}
export function setLoginStatus(token) {
  Cookies.set(isLogin, token, { expires: 1 })
}
