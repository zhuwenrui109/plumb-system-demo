import request from "@/utils/request";

export const getList = (data) => {
  return request.post("api/stations", data);
};

export const getDetail = (id) => {
  return request.get(`api/stationsDetail/${id}`)
};

export const editStand = (data) => {
  return request.post("api/stationsStore", data);
};

export const editRegion = (data) => {
  return request.post("api/regionsStore", data);
};
