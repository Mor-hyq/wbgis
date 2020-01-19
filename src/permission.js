import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import config from '@/config'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const isLogin = store.getters.isLogin
  // const isLogin = '1'
  if (isLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else if (to.path === '/404') {
      // 404页面不进行权限判断
      next()
    } else {
      if (store.state.permission.permissionList.length < 1) {
        // 获取登录用户基本信息及权限列表
        store.dispatch('permission/getPermission')
          .then(() => {
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          }).catch((error) => {
            // 捕获403错误时不跳转页面 通过响应拦截器 弹出的重新登录页面进行登录操作
            if (error.message.indexOf('403') < 0) {
              next({
                path: '/'
              })
            }
          })
      } else if (to.path === '/' && to.name) {
        // 匹配到无权限页面时 此时页面path变为/且含有name值 则重定向到404页面
        next({
          path: '*'
        })
      } else {
        // 去首页或404页面 不鉴权
        if (to.path === '/' || to.path === '*') {
          next()
        } else {
          next()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      let redirect = `redirect=${encodeURIComponent(to.path)}`
      redirect += to.name ? `&redirectName=${to.name}` : ''
      next(`/login?${redirect}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
