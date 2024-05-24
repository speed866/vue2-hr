import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

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
  async login({ commit }, data) {
    const result = await login(data)
    commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
