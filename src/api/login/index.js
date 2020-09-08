import request from '@/utils/request'
import loginApi from './apiMap'

// 表单csrftoken接口
export function getCsrfToken() {
  return request({
    url: loginApi.loginToken,
    method: 'get'
  })
}
// 发送短信验证码接口
export function sendCode({
  phone,
  username
} = {}) {
  return request({
    url: loginApi.loginSendCode,
    method: 'post',
    data: {
      phone,
      username
    }
  })
}

// 登录接口
export function login({
  csrftoken,
  username,
  password
} = {}) {
  return request({
    url: loginApi.login,
    method: 'post',
    data: {
      csrftoken,
      username,
      password
    }
  })
}

// 登出接口
export function logout() {
  return request({
    url: loginApi.logout,
    method: 'post'
  })
}
// 获取权限
export function fetchPermission({
  pid = 0
} = {}) {
  return request({
    url: loginApi.permission,
    method: 'get',
    params: {
      pid
    }
  })
}
