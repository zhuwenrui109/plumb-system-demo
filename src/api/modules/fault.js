import request from "@/utils/request";

export const getCharts = (data) => {
  return request.post("api/historyDataCharts", data);
};

export const getList = (data) => {
  return request.post("api/historyDataList", data);
};
