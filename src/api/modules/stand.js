import request from "@/utils/request";

export const getList = (data) => {
  return request.post("api/stations", data);
};

export const getStandDetail = (id) => {
  return request.get(`api/stationsDetail/${id}`)
};

export const getRegionDetail = (id) => {
  return request.get(`api/regionsDetail/${id}`)
};

export const editStand = (data) => {
  return request.post("api/stationsStore", data);
};

export const editRegion = (data) => {
  return request.post("api/regionsStore", data);
};

export const deleteStandDetail = (id) => {
  return request.get(`api/stationsDelete/${id}`)
};

export const deleteRegionDetail = (id) => {
  return request.get(`api/regionsDelete/${id}`)
};

export const standSort = (id) => {
  return request.get(`api/stationSort/${id}`)
};

export const areaSort = (id) => {
  return request.get(`api/regionSort/${id}`)
};
