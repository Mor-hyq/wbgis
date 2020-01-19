
import {
  getPipeState, getBelongPipe,
  getAccidentType, getAccidentLevel,
  getResultPlanType, getExercisePlanState,
  getInspectTypeState, getFaultTypeState,
  getMaintainSelect
} from '@/api/common'
import { getCompanySelet } from '@/api/system'
const state = {
  workState: [], // 运行状态
  belongPipe: [], // 所属管道
  accidentType: [], // 事故类型
  accidentLevel: [], // 事故等级
  resultPlan: [], // 应急预案
  exercisePlanState: [], // 计划状态
  companySelect: [], // 单位下拉数据
  inspectTypeSelect: [], // 维修方式下拉数据
  faultTypeSelect: [], // 错误类型下拉数据
  maintainSelect: [], // 获取维护表单下拉列表
  userStatus: [
    {
      id: 1,
      label: '启用'
    },
    {
      id: 0,
      label: '禁用'
    }
  ], // 账户状态
  assetTab: '0', // 应急管理的选中tab数据
  maintainTab: '1' // 维护页面选中tab数据
}

const mutations = {
  SET_WORKSTATE: (state, data) => {
    state.workState = data
  },
  SET_BELONGPIPE: (state, data) => {
    state.belongPipe = data
  },
  SET_ACCIDENTTYPE: (state, data) => {
    state.accidentType = data
  },
  SET_ACCIDENTLEVEL: (state, data) => {
    state.accidentLevel = data
  },
  SET_RESULTPLAN: (state, data) => {
    state.resultPlan = data
  },
  SET_EXERCISEPLANSTATE: (state, data) => {
    state.exercisePlanState = data
  },
  SET_COMPANYSELECT: (state, data) => {
    state.companySelect = data
  },
  SET_INSPECTTYPESELECT: (state, data) => {
    state.inspectTypeSelect = data
  },
  SET_FAULTTYPESELECT: (state, data) => {
    state.faultTypeSelect = data
  },
  SET_ASSET_TAB: (state, data) => {
    state.assetTab = data
  },
  SET_MAINTAIN_TAB: (state, data) => {
    state.maintainTab = data
  },
  SET_MAINTAINSELECT: (state, data) => {
    state.maintainSelect = data
  }
}

const actions = {
  async setWorkState({ commit }) {
    try {
      const { code, data } = await getPipeState()
      if (code === 200) {
        commit('SET_WORKSTATE', data || [])
      }
    } catch (error) {
      commit('SET_WORKSTATE', [])
    }
  },
  async setBelongPipe({ commit }) {
    try {
      const { code, data } = await getBelongPipe()
      if (code === 200) {
        commit('SET_BELONGPIPE', data || [])
      }
    } catch (error) {
      commit('SET_BELONGPIPE', [])
    }
  },
  async setAccidentType({ commit }) {
    try {
      const { code, data } = await getAccidentType()
      if (code === 200) {
        commit('SET_ACCIDENTTYPE', data || [])
      }
    } catch (error) {
      commit('SET_ACCIDENTTYPE', [])
    }
  },
  async setAccidentLevel({ commit }) {
    try {
      const { code, data } = await getAccidentLevel()
      if (code === 200) {
        commit('SET_ACCIDENTLEVEL', data || [])
      }
    } catch (error) {
      commit('SET_ACCIDENTLEVEL', [])
    }
  },
  async setResultPlan({ commit }) {
    try {
      const { code, data } = await getResultPlanType()
      if (code === 200) {
        commit('SET_RESULTPLAN', data || [])
      }
    } catch (error) {
      commit('SET_RESULTPLAN', [])
    }
  },
  async setExercisePlanState({ commit }) {
    try {
      const { code, data } = await getExercisePlanState()
      if (code === 200) {
        commit('SET_EXERCISEPLANSTATE', data || [])
      }
    } catch (error) {
      commit('SET_EXERCISEPLANSTATE', [])
    }
  },
  async setCompanySelect({ commit }) {
    try {
      const { code, data } = await getCompanySelet()
      if (code === 200) {
        commit('SET_COMPANYSELECT', data || [])
      }
    } catch (error) {
      commit('SET_COMPANYSELECT', [])
    }
  },
  async setInspectTypeSelect({ commit }) {
    try {
      const { code, data } = await getInspectTypeState()
      if (code === 200) {
        commit('SET_INSPECTTYPESELECT', data || [])
      }
    } catch (error) {
      commit('SET_INSPECTTYPESELECT', [])
    }
  },
  async setFaultTypeSelect({ commit }) {
    try {
      const { code, data } = await getFaultTypeState()
      if (code === 200) {
        commit('SET_FAULTTYPESELECT', data.data || [])
      }
    } catch (error) {
      commit('SET_FAULTTYPESELECT', [])
    }
  },
  async setMaintainSelect({ commit }) {
    try {
      const { code, data } = await getMaintainSelect()
      if (code === 200) {
        commit('SET_MAINTAINSELECT', data || [])
      }
    } catch (error) {
      commit('SET_MAINTAINSELECT', [])
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
