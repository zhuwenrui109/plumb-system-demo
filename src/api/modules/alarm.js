import request from "@/utils/request";

export const getList = data => {
  return request.post("api/historyAlarms", data)
};

export const batchDelData = data => {
  return request.post("api/historyAlarmsDelete", data)
};

export const exprotData = (data, params) => {
  return request.get(`api/exportHistoryAlarms?selected_id=${data}`, params)
};
