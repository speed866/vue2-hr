import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken() || ''
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = ''
    removeToken()
  }
}

const actions = {
  login({ commit }, data) {
    commit('setToken', '111111')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
