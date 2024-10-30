import request from "@/utils/request";

export const getList = data => {
  return request.post("api/devices", data);
};

export const deleteManage = (id) => {
  return request.get(`api/deviceDelete/${id}`);
};

export const getDetail = (id) => {
  return request.get(`api/deviceDetail/${id}`);
};

export const editManage = (data) => {
  return request.post("api/deviceStore", data);
};

