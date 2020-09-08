
import router, {
  asyncRoutes,
  DynamicRoutes
} from '@/router'
import {
  fetchPermission
} from '@/api/login'
import {
  recursionRouter,
  setDefaultRoute
} from '@/utils/permission'
import { cloneDeep } from 'lodash'
const permission = {
  namespaced: true,
  state: {
    /** 所有路由 */
    permissionList: [],
    /** 导航菜单 */
    sidebarMenu: [],
    /** 当前active导航菜单 */
    currentMenu: '',
    // 角色权限路由
    fetchPermissionList: []
  },
  mutations: {
    // 设置所有的路由
    SET_PERMISSION(state, routes) {
      state.permissionList = routes
    },
    SET_MENU(state, menu) {
      state.sidebarMenu = menu
    },
    CLEAR_MENU(state) {
      state.sidebarMenu = []
    },
    SET_CURRENT_MENU(state, currentMenu) {
      state.currentMenu = currentMenu
    },
    // 设置角色所拥有的路由
    SET_FETCHPERMISSIONLIST(state, permission) {
      state.fetchPermissionList = permission
    }
  },
  actions: {
    async getPermission({
      commit,
      rootState
    }) {
      try {
        const {
          code,
          data: permissionList
        } = await fetchPermission()
        if (code === 200) {
          /*  获取后台给的权限数组 */
          /*  根据后台权限跟我们定义好的权限对比,生成用户权限路由 */
          const routes = recursionRouter(permissionList[0].children, cloneDeep(asyncRoutes))
          /* 生成左侧导航菜单 */
          commit('SET_MENU', routes)
          // 为路由设置默认redirect值
          setDefaultRoute(routes)
          commit('SET_FETCHPERMISSIONLIST', cloneDeep(routes))
          /*  初始路由 */
          const initialRoutes = cloneDeep(router.options.routes)
          /*  动态添加路由 */
          router.addRoutes(routes.concat(DynamicRoutes))
          const DynamicRoutess = cloneDeep(DynamicRoutes)
          /* 完整的路由表 */
          commit('SET_PERMISSION', [...initialRoutes, ...routes, ...DynamicRoutess])
          return Promise.resolve()
        } else {
          commit('SET_PERMISSION', [...DynamicRoutes])
          return Promise.reject('404')
        }
      } catch (error) {
        commit('SET_PERMISSION', [...DynamicRoutes])
        return Promise.reject(error)
      }
    }
  }
}

export default permission
