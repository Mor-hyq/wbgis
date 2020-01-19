
import { getCSRFToken, setCSRFToken, removeCSRFToken, getUserInfo,
  setUserInfo, removeUserInfo, getLoginStatus, removeLoginStatus,
  setLoginStatus
} from '@/utils/auth'
import { resetRouter } from '@/router'
import { Notification } from 'element-ui'

const state = {
  csrftoken: getCSRFToken() || '', // csrftoken
  userInfo: getUserInfo() || {}, // 用户信息
  isLogin: getLoginStatus(), // 登录状态
  unionTreeData: '', // 工会组织树数据
  unionSearchTreeData: '', // 工会组织树查询数据
  accountUnionTreeData: '', // 当前账号下的工会组织树
  accountUnionSearchTreeData: '' // 当前账号下的工会组织树查询数据
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.csrftoken = token
    setCSRFToken(token)
  },
  SET_USERINFO: (state, data) => {
    state.userInfo = data
    setUserInfo(data)
  },
  SET_LOGIN: (state, data) => {
    state.isLogin = data
    setLoginStatus(data)
  },
  REMOVE_LOGIN: (state) => {
    removeLoginStatus()
    state.isLogin = null
  },
  SET_UNIONTREE: (state, data) => {
    state.unionTreeData = data
  },
  SET_UNIONSEARCHTREE: (state, data) => {
    state.unionSearchTreeData = data
  },
  SET_ACCOUNT_UNIONTREE: (state, data) => {
    state.accountUnionTreeData = data
  },
  SET_ACCOUNT_UNIONSEARCHTREE: (state, data) => {
    state.accountUnionSearchTreeData = data
  }
}

const actions = {
  // 清空token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeCSRFToken()
      removeUserInfo()
      resetRouter()
      commit('REMOVE_LOGIN')
      commit('SET_TOKEN', '')
      commit('SET_UNIONTREE', '')
      commit('SET_UNIONSEARCHTREE', '')
      commit('SET_ACCOUNT_UNIONTREE', '')
      commit('SET_ACCOUNT_UNIONSEARCHTREE', '')
      commit('permission/SET_PERMISSION', [], { root: true })
      commit('permission/SET_FETCHPERMISSIONLIST', [], { root: true })
      commit('member/SET_AUTHORITY', [], { root: true })
      commit('form/SET_MAINTAIN_TAB', '1', { root: true })
      Notification.closeAll()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

