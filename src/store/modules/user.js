import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
  token: getToken() || '',
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  setUserInfo(state, info) {
    state.userInfo = info
  }
}

const actions = {
  async login({ commit }, data) {
    const result = await login(data)
    commit('setToken', result)
  },
  async getUserInfo({ commit }) {
    const userInfo = await getUserInfo()
    commit('setUserInfo', userInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
