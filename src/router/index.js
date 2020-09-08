import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Router Modules */
import gis from './modules/gis'
import inspect from './modules/inspect'
import emergency from './modules/emergency'
import equipmentInfo from './modules/equipmentInfo'
import system from './modules/system'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, itemwill not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar 128*128
    noCache: true                if set true, the page will no be cached(default is false)
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
    level: '1' 路由层级 1-1 1-2
    permission: [{ 路由中的按钮权限
      title: '', 权限树中显示的label
      value: ''  判断用的值
    }, {
      title: '复制到自由训练',
      value: 'copy'
    }],
    fields: [ 路由中的字段权限
      {
        title: '字段1',
        value: 'field1'
      },
      {
        title: '字段2',
        value: 'field2'
      }
    ]
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [ // 该路由不设置name值
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/views/dashboard/index'),
    redirect: '/gis',
    hidden: true,
    meta: {
      title: '首页'
    }
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  gis,
  inspect,
  equipmentInfo,
  emergency,
  system
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

// 404 不能写到路由 要 在addrouter里进行拼接404这个路由
export const DynamicRoutes = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
