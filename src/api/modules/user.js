import request from "@/utils/request";

export const getList = (data) => {
  return request.post("api/users", data);
};

export const addUser = (data) => {
  return request.post("api/userStore", data);
};

export const getDetail = (id) => {
  return request.get(`api/userDetail/${id}`);
};

export const deleteUser = (id) => {
  return request.get(`api/userDelete/${id}`);
};
