import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogined: false
  },
  mutations: {
    setValue (state, newV) {
      state.isLogined = newV
    }
  }
})

export default store
