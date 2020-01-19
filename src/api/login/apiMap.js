// const Config = require('@/config')
// const mode = Config.mode

const api = {
  // 获取表单csrftoken
  loginToken: 'admin/index/csrfotoken',
  // 发送短信验证码接口
  loginSendCode: 'admin/index/sendVerifyCode',
  // 登录接口
  login: 'admin/index/login',
  // 登出接口
  logout: 'admin/index/logout',
  // 用户权限接口
  permission: 'admin/menu'
}

// local模式接口添加
// if (mode === 'local') {
//   for (const k in api) {
//     if (api[k].indexOf('?') < 0) {
//       api[k] = `${api[k]}?debug=cross`
//     } else {
//       api[k] = `${api[k]}&debug=cross`
//     }
//   }
// }

export default api
