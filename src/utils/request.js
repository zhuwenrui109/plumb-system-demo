import axios from "axios";

const request = axios.create({
  baseURL: "/api", // 此处的 '/api' 和 vite.config.js 的配置相关联
  timeout: 50000,
  requestOptions: {
    withToken: true,
  },
});

// 数据请求拦截
request.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  token && config.requestOptions.withToken && (config.headers.token = token);
  return config;
}, (err) => {
  return Promise.reject(err);
}
);

// 返回响应数据拦截
request.interceptors.response.use(
  (response) => {
    if (response.data.code == "200") {
      return Promise.resolve(response.data);
    }
  }, (error) => {
    console.log("错误信息", error);
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          console.log("请求路径找不到！");
          break;
        case 500:
          console.log("服务器内部报错！");
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