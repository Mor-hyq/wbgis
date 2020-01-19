import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import Qs from 'qs'
import dayjs from 'dayjs'
// import router from '@/router'
// import { getToken } from '@/utils/auth'

// 导入 项目配置 文件
import ProjectConfig from '@/config'
const mode = ProjectConfig.mode // 当前模式
const urlConfig = ProjectConfig[mode].url
// create an axios instance
const service = axios.create({
  baseURL: urlConfig.baseURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: urlConfig.timeout, // request timeout
  // headers: { 'content-type': 'application/json' }
  paramsSerializer: function(params) {
    return Qs.stringify(params, {
      serializeDate: (date) => {
        // 用dayjs处理日期比较方便，自己写格式化方法也可以
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }
})
// 去除提交数据的两边空格
const trimData = (data) => {
  for (const k in data) {
    if (typeof data[k] === 'string') {
      data[k] = (data[k]).trim()
    } else if (typeof data[k] === 'object') {
      trimData(data[k])
    }
  }
}
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['content-type'] = 'application/json'
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    // 去除params参数中的前后空格
    if (config.params) {
      trimData(config.params)
    }
    // 去除data参数中的前后空格
    if (config.data) {
      trimData(config.data)
    }
    // 判断接口返回后如果失败是否显示toast
    if (config.params && config.params.notShowToast) {
      config.notShowToast = config.params.notShowToast
      delete config.params.notShowToast
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 重新登录
    // if (res.code === 403 || res.code === 40003) {
    if (res.code === 403) {
      // 加锁 避免多个异步请求同时返回403时触发多次跳转
      const loginLock = sessionStorage.getItem('loginLock') || ''
      if (loginLock) {
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        sessionStorage.setItem('loginLock', 'true')
        // to re-login
        MessageBox.confirm(res.msg, '重新登录', {
          confirmButtonText: '重新登录',
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
          return res
        })
      }
    } else if (res.code !== 200) {
      if (!response.config.notShowToast) {
        // 非200状态码统一显示提示
        Message({
          type: 'error',
          message: res.msg || `请求失败 ${res.code}`,
          duration: 1500
        })
      }
    }
    // return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    return res
    // }
  },
  (error) => {
    // 403错误重新登录
    // if (error.message.indexOf('403') > 0) {
    if (error && error.response) {
      if (error.response.status === 403) {
        const loginLock = sessionStorage.getItem('loginLock') || ''
        if (loginLock) {
          return Promise.reject(error)
        } else {
          sessionStorage.setItem('loginLock', 'true')
          // to re-login
          MessageBox.confirm('登录过期，请重新登录', '重新登录', {
            confirmButtonText: '重新登录',
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
            // return Promise.reject(error)
          })
        }
      } else {
        const msg = error.response.data.msg || `请求异常 ${error.response.status}`
        Message({
          type: 'error',
          message: msg,
          duration: 1500
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
