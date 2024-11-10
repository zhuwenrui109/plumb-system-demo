import { createStore } from 'vuex'

const store = createStore({
  state: {
    standList: [],
    windowCount: 0,
    alarmList: [],
    faultList: [],
    pluginDom: null,
    user: {
      username: "",
      role: "",
      token: ""
    }
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setStandList(state, data) {
      state.standList = [...data];
    },
    setAlarmList(state, data) {
      state.alarmList = [...data];
    },
    setFaultList(state, data) {
      state.faultList = [...data];
    },
    setWindowCount(state, data) {
      state.windowCount = data;
    },
    setPluginDom(state, data) {
      state.pluginDom = data;
    }
  },
  actions: {
    handleUser(context, data) {
      context.commit("setUser", data)
    },
    handleStandList(context, data) {
      context.commit("setStandList", data)
    },
    handleAlarmList(context, data) {
      context.commit("setAlarmList", data)
    },
    handleFaultList(context, data) {
      context.commit("setFaultList", data)
    },
    handleWindowCount(context, data) {
      context.commit("setWindowCount", data)
    },
    handlePluginDom(context, data) {
      context.commit("setPluginDom", data)
    }
  },
  getters: {
    getDeviceList(state) {
      let arr = [];
      if (!state.standList.length || state.windowCount == 0) {
        return arr;
      }
      let deviceList = [];
      state.standList.forEach((station, sIndex) => {
        station.regions.forEach((region, rIndex) => {
          // 防止测试数据没有设备
          if (Object.keys(region.device).length > 0) {
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
        console.log("while");
        if (state.windowCount == "1*2") {
          j += 2;
        } else {
          j += state.windowCount * state.windowCount;
        }
        arr.push([...deviceList.slice(o, j)]);
        o = j;
      }
      return arr;
    }
  }
})

export default store