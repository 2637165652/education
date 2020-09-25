import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogined: false,
    user: {}
  },
  mutations: {
    setLoginStatus (state, newV) {
      state.isLogined = newV
    },
    setUser (state, newV) {
      state.user = newV
    }
  }
})

export default store
