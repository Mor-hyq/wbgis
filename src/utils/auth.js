import Cookies from 'js-cookie'
// import config from '@/config'
// const mode = config.mode
// token
const TokenKey = 'csrftoken'
// 用户信息
const UserInfo = 'userInfo'

// 前端登录状态
const isLogin = 'gis___session'

// 一级域名
// const domainName = mode === 'local' ? 'localhost' : '.' + document.domain.split('.').slice(-2).join('.')

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
  // const info = Cookies.get(UserInfo, { domain: domainName }) ? JSON.parse(Cookies.get(UserInfo, { domain: domainName })) : ''
  const info = Cookies.get(UserInfo) ? JSON.parse(Cookies.get(UserInfo)) : ''
  return info
}

export function setUserInfo(data) {
  // return Cookies.set(UserInfo, JSON.stringify(data), { domain: domainName, expires: 1 })
  Cookies.set(UserInfo, JSON.stringify(data), { expires: 1 })
}
export function removeUserInfo() {
  // return Cookies.remove(UserInfo, { domain: domainName })
  Cookies.remove(UserInfo)
}

export function getLoginStatus() {
  // return Cookies.get(isLogin, { domain: domainName })
  return Cookies.get(isLogin)
}
export function removeLoginStatus() {
  // return Cookies.remove(isLogin, { domain: domainName })
  Cookies.remove(isLogin)
}
export function setLoginStatus(token) {
  // return Cookies.set(isLogin, token, { domain: domainName, expires: 1 })
  Cookies.set(isLogin, token, { expires: 1 })
}
