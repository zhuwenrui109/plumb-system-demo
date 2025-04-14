import { createStore } from 'vuex'

const testFaultList = [
  {
    "device_id": 1557,
    "sensor_ip": "192.168.1.182",
    "sensor_port": "505",
    "station_id": 21,
    "region_id": 12,
    "gas": "62169",
    "light": 1,
    "station": {
      "station_id": 21,
      "name": "沈阳分输站"
    },
    "region": {
      "region_id": 12,
      "name": "过滤区"
    }
  },
  {
    "device_id": 1552,
    "sensor_ip": "192.168.1.181",
    "sensor_port": "500",
    "station_id": 2,
    "region_id": 2,
    "gas": "62169",
    "light": 9,
    "station": {
      "station_id": 2,
      "name": "大连计量站"
    },
    "region": {
      "region_id": 2,
      "name": "清管区"
    }
  }
];

const testAlarmList = [
  {
    "alarm_id": 85,
    "device_id": 1552,
    "level": 2,
    "density": "68276",
    "video": "/rtspVideo/202412/06/144033/1733467233_1552.mp4",
    "station_id": 2,
    "region_id": 2,
    "mute_status": 1,
    "created_at": "2024-12-08 22:31:16",
    "station": {
      "station_id": 2,
      "name": "大连计量站"
    },
    "region": {
      "region_id": 2,
      "name": "清管区"
    }
  },
  {
    "alarm_id": 86,
    "device_id": 1557,
    "level": 2,
    "density": "68276",
    "video": "/rtspVideo/202412/06/144033/1733467233_1557.mp4",
    "station_id": 21,
    "region_id": 12,
    "mute_status": 1,
    "created_at": "2024-12-08 22:31:16",
    "station": {
      "station_id": 21,
      "name": "沈阳分输站"
    },
    "region": {
      "region_id": 12,
      "name": "过滤区"
    }
  },
  {
    "alarm_id": 421,
    "device_id": 1595,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144753/1733467673_1595.mp4",
    "station_id": 22,
    "region_id": 21,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 22,
      "name": "营口压气站"
    },
    "region": {
      "region_id": 21,
      "name": "空冷区"
    }
  },
  {
    "alarm_id": 422,
    "device_id": 1596,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144753/1733467673_1596.mp4",
    "station_id": 22,
    "region_id": 53,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 22,
      "name": "营口压气站"
    },
    "region": {
      "region_id": 53,
      "name": "压缩机组"
    }
  },
  {
    "alarm_id": 423,
    "device_id": 1597,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144753/1733467673_1597.mp4",
    "station_id": 22,
    "region_id": 54,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 22,
      "name": "营口压气站"
    },
    "region": {
      "region_id": 54,
      "name": "A区"
    }
  },
  {
    "alarm_id": 424,
    "device_id": 1598,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144753/1733467673_1598.mp4",
    "station_id": 22,
    "region_id": 55,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 22,
      "name": "营口压气站"
    },
    "region": {
      "region_id": 55,
      "name": "B区"
    }
  },
  {
    "alarm_id": 330,
    "device_id": 1599,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144633/1733467593_1599.mp4",
    "station_id": 43,
    "region_id": 62,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 43,
      "name": "铁岭计量站"
    },
    "region": {
      "region_id": 62,
      "name": "过滤区"
    }
  },
  {
    "alarm_id": 331,
    "device_id": 1600,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144633/1733467593_1600.mp4",
    "station_id": 43,
    "region_id": 63,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 43,
      "name": "铁岭计量站"
    },
    "region": {
      "region_id": 63,
      "name": "清管区"
    }
  },
  {
    "alarm_id": 332,
    "device_id": 1601,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144633/1733467593_1601.mp4",
    "station_id": 43,
    "region_id": 64,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 43,
      "name": "铁岭计量站"
    },
    "region": {
      "region_id": 64,
      "name": "调压撬区"
    }
  },
  {
    "alarm_id": 87,
    "device_id": 1602,
    "level": 2,
    "density": "67244",
    "video": "/rtspVideo/202412/06/144033/1733467233_1602.mp4",
    "station_id": 43,
    "region_id": 65,
    "mute_status": 1,
    "created_at": "2024-12-06 14:40:44",
    "station": {
      "station_id": 43,
      "name": "铁岭计量站"
    },
    "region": {
      "region_id": 65,
      "name": "压缩机组"
    }
  },
  {
    "alarm_id": 88,
    "device_id": 1603,
    "level": 2,
    "density": "67268",
    "video": "/rtspVideo/202412/06/144033/1733467233_1603.mp4",
    "station_id": 43,
    "region_id": 66,
    "mute_status": 1,
    "created_at": "2024-12-06 14:41:08",
    "station": {
      "station_id": 43,
      "name": "铁岭计量站"
    },
    "region": {
      "region_id": 66,
      "name": "A区"
    }
  },
  {
    "alarm_id": 89,
    "device_id": 1604,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1604.mp4",
    "station_id": 43,
    "region_id": 67,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 43,
      "name": "铁岭计量站"
    },
    "region": {
      "region_id": 67,
      "name": "B区"
    }
  },
  {
    "alarm_id": 90,
    "device_id": 1605,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1605.mp4",
    "station_id": 44,
    "region_id": 56,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 56,
      "name": "过滤区"
    }
  },
  {
    "alarm_id": 91,
    "device_id": 1606,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1606.mp4",
    "station_id": 44,
    "region_id": 57,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 57,
      "name": "清管区"
    }
  },
  {
    "alarm_id": 92,
    "device_id": 1607,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1607.mp4",
    "station_id": 44,
    "region_id": 58,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 58,
      "name": "调压撬区"
    }
  },
  {
    "alarm_id": 93,
    "device_id": 1608,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1608.mp4",
    "station_id": 44,
    "region_id": 59,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 59,
      "name": "压缩机组"
    }
  },
  {
    "alarm_id": 94,
    "device_id": 1609,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1609.mp4",
    "station_id": 44,
    "region_id": 60,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:58",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 60,
      "name": "A区"
    }
  },
  {
    "alarm_id": 95,
    "device_id": 1610,
    "level": 2,
    "density": "67738",
    "video": "/rtspVideo/202412/06/144034/1733467234_1610.mp4",
    "station_id": 44,
    "region_id": 61,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:59",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 61,
      "name": "B区"
    }
  },
  {
    "alarm_id": 96,
    "device_id": 1612,
    "level": 2,
    "density": "67739",
    "video": "/rtspVideo/202412/06/144034/1733467234_1612.mp4",
    "station_id": 44,
    "region_id": 61,
    "mute_status": 1,
    "created_at": "2024-12-06 14:48:59",
    "station": {
      "station_id": 44,
      "name": "盘锦分输站"
    },
    "region": {
      "region_id": 61,
      "name": "B区"
    }
  }
]

const store = createStore({
  state: {
    iWndIndex: 0,
    iWndowPage: 0,
    standList: [],
    windowCount: 0,
    alarmList: [...testAlarmList],
    faultList: [...testFaultList],
    user: {
      username: "",
      role: "",
      token: ""
    },
    initPlugin: () => { },
    destoryPlugin: () => { },
    pauseAudio: () => { }
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
      state.standList = [].concat(data);
    },
    setAlarmList(state, data) {
      state.alarmList = [].concat(data);
    },
    setFaultList(state, data) {
      state.faultList = [].concat(data);
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
      for (let i = 0; i < state.standList.length; i++) {
        const { regions } = state.standList[i];
        for (let j = 0; j < regions.length; j++) {
          const region = regions[j];
          // 防止测试数据没有设备
          if (Object.keys(region.device).length > 0) {
            const { device } = region;
            device["szDeviceIdentify"] = `${device.monitor_ip}_${device.monitor_port}`;
            deviceList.push({
              sIndex: i,
              rIndex: j,
              device
            })
          }
        }
      }
      // state.standList.forEach((station, sIndex) => {
      //   station.regions.forEach((region, rIndex) => {
      //     // 防止测试数据没有设备
      //     if (Object.keys(region.device).length > 0) {
      //       const { device } = region;
      //       device["szDeviceIdentify"] = `${device.monitor_ip}_${device.monitor_port}`;
      //       deviceList.push({
      //         sIndex,
      //         rIndex,
      //         device
      //       })
      //     }
      //   });
      // })
      let j = 0,
        o = j;
      // windowCount为一组（页）
      while (j < deviceList.length) {
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