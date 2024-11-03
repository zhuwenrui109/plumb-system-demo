import { createStore } from 'vuex'

const store = createStore({
  state: {
    standList: [],
    windowCount: 16
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
  getters: {
    getDeviceList(state) {
      let arr = [];
      if (!state.standList.length) {
        return arr;
      }
      let deviceList = [];
      state.standList.forEach((station, sIndex) => {
        station.regions.forEach((region, rIndex) => {
          // 防止测试数据没有设备
          if (region.device) {
            deviceList.push({
              sIndex,
              rIndex,
              device: region.device
            })
          }
        });
      })
      let j = 0,
        o = j;
      // windowCount为一组（页）
      while (j < deviceList.length) {
        j += state.windowCount;
        arr.push([...deviceList.slice(o, j)]);
        o = j;
      }
      return arr;
    }
  }
})

export default store