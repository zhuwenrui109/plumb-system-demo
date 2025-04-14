import Mock from 'mockjs'

import standList from './data/standList.js';


Mock.mock('/api/auth/login', { code: 200, token: "@id", user_role: 1 })
Mock.mock('/api/index', { code: 200, data: standList })
Mock.mock('/api/auth/currentUser', {
  code: 200, "user_info": {
    "id": 43,
    "account": "zwr",
    "name": "zwr",
    "role": 1,
    "status": 1,
    "created_at": "2024-11-20 22:32:31"
  }
})
Mock.mock('/api/config/windows_number', {
  code: 200, data: {
    value: "4"
  }
})
