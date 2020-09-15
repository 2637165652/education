import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogined: false
  },
  mutations: {
    setLoginStatus (state, newV) {
      state.isLogined = newV
    }
  }
})

export default store
