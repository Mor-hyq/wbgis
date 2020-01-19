const state = {
  authority: []
}

const mutations = {
  SET_AUTHORITY: (state, data) => {
    state.authority = data
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
