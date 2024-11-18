import { createStore } from 'vuex'

const store = createStore({
  state: {
    iWndIndex: 0,
    iWndowPage: 0,
    standList: [],
    windowCount: 0,
    alarmList: [],
    faultList: [],
    user: {
      username: "",
      role: "",
      token: ""
    },
    initPlugin: () => {},
    destoryPlugin: () => {},
    pauseAudio: () => {}
  },
  mutations: {
    setPauseAudio(state, data) {
      state.pauseAudio = data;
    },
    setIWndPage(state, data) {
      state.iWndowPage = data;
    },
    setIWndIndex(state, data) {
      state.iWndIndex = data;
    },
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
    setInitPlugin(state, data) {
      state.initPlugin = data;
    },
    setDestoryPlugin(state, data) {
      state.destoryPlugin = data;
    }
  },
  actions: {
    handlePauseAudio(context, data) {
      context.commit("setPauseAudio", data)
    },
    handleIWndPage(context, data) {
      context.commit("setIWndPage", data)
    },
    handleIWndIndex(context, data) {
      context.commit("setIWndIndex", data)
    },
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
    handleInitPlugin(context, data) {
      context.commit("setInitPlugin", data)
    },
    handleDestoryPlugin(context, data) {
      context.commit("setDestoryPlugin", data)
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
            const { device } = region;
            device["szDeviceIdentify"] = `${device.monitor_ip}_${device.monitor_port}`;
            deviceList.push({
              sIndex,
              rIndex,
              device
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
        } else if (state.windowCount == 1) {
          j += 4 * 4;
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