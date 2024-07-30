import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  getters: {
  },
  mutations: {
    updateUser(state, {userName, profilePic, userRole}) {
        state.user = {
          userName,
          profilePic,
          userRole
        }
      }
  },
  actions: {
  },
  modules: {
  }
})
