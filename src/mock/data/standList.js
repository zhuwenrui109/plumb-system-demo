import Mock from 'mockjs'

const standList = Mock.mock([
  {
    station_id: 2,
    name: "大连计量站",
    status: 1,
    regions_count: 1,
    regions: [
      {
        region_id: 2,
        name: "清管区",
        station_id: 2,
        status: 1,
        sort: 1730958629,
        device: {
          device_id: 1552,
          sensor_ip: "192.168.1.181",
          sensor_port: "500",
          monitor_ip: "192.168.1.64",
          monitor_port: "80",
          station_id: 2,
          region_id: 2,
          threshold_first: "1000",
          threshold_second: "5000",
          status: 1,
          connection_status: 1,
          contrl_user: 43,
          speed: 15
        }
      }
    ]
  },
  {
    station_id: 21,
    name: "沈阳分输站",
    status: 1,
    regions_count: 1,
    regions: [
      {
        region_id: 12,
        name: "过滤区",
        station_id: 21,
        status: 1,
        sort: 1730789147,
        device: {
          device_id: 1557,
          sensor_ip: "192.168.1.182",
          sensor_port: "505",
          monitor_ip: "192.168.1.66",
          monitor_port: "80",
          station_id: 21,
          region_id: 12,
          threshold_first: "1000",
          threshold_second: "5000",
          status: 1,
          connection_status: 1,
          contrl_user: 1,
          speed: 15
        }
      }
    ]
  },
  {
    station_id: 43,
    name: "铁岭计量站",
    status: 1,
    regions_count: 0,
    regions: []
  },
  {
    station_id: 44,
    name: "盘锦分输站",
    status: 1,
    regions_count: 0,
    regions: []
  },
  {
    station_id: 23,
    name: "鞍山调压站",
    status: 1,
    regions_count: 0,
    regions: []
  },
  {
    station_id: 22,
    name: "营口压气站",
    status: 1,
    regions_count: 0,
    regions: []
  }
])

export default standList;