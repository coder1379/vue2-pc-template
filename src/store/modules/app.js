const state = {
  userName: ''
}
const mutations = {
  // 同步修改 this.$store.commit('SET_USER_NAME','name') 为了和异步区分改用大写
  SET_USER_NAME(state, name) {
    state.userName = name
  }
}
const actions = {
  // 异步修改 this.$store.dispatch('setUserName','name'),不使用异步修改可以不用添加
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  }
}
export default {
  state,
  mutations,
  actions
}
