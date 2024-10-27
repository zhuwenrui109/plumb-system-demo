import axios from "axios";
import { clearToken, tokenExpressInTime } from "./tool";

const request = axios.create({
  baseURL: "/api", // 此处的 '/api' 和 vite.config.js 的配置相关联
  timeout: 50000,
  requestOptions: {
    withToken: true,
  },
});

// 数据请求拦截
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && tokenExpressInTime()) {
    console.log("登录过期");
    clearToken();
    return false;
  }
  config.requestOptions.withToken && (config.headers.Authorization = token);
  return config;
}, (err) => {
  return Promise.reject(err);
}
);

// 返回响应数据拦截
request.interceptors.response.use(
  (response) => {
    if (response.status == "200") {
      return Promise.resolve(response.data);
    }
  }, (error) => {
    console.log("错误信息", error);
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          console.log("有异常");
          break;
        case 401:
          console.log("登录状态失效");

          break;
        case 500:
          console.log("接口翻车");
          break;
        // 还可以自己添加其他状态码
        default:
          break;
      }
    }
    return Promise.reject(new Error(error.message));
  }
);

// 暴露对象
export default request;