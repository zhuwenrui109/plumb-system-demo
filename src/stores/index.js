import { createStore } from 'vuex'

const store = createStore({
  state: {
    standList: [],
    windowCount: 1
  },
  mutations: {
    setStandList(state, data) {
      state.standList = [...data];
    },
    setWindowCount(state, data) {
      state.windowCount = data;
    }
  },
  actions: {
    handleStandList(context, data) {
      context.commit("setStandList", data)
    },
    handleWindowCount(context, data) {
      context.commit("setWindowCount", data)
    }
  },
  getters: {}
})

export default store