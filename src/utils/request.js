import axios from "axios";
import { clearToken, tokenExpressInTime } from "./tool";
import toastPlguin from "./toast";
import router from "@/router";

const request = axios.create({
  baseURL: "/",
  timeout: 50000,
  requestOptions: {
    withToken: true,
  },
});

// 数据请求拦截
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem("token");
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
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          break;
        case 401:
          toastPlguin(error.response.data.message);
          setTimeout(() => {
            router.push({ name: "login" })
          })
          break;
        case 500:
          break;
        // 还可以自己添加其他状态码
        default:
          break;
      }
    }
    return Promise.reject(error.response.data);
  }
);

// 暴露对象
export default request;