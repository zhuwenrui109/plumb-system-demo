import request from "@/utils/request";

export const getCharts = (data) => {
  return request.post("api/historyDataCharts", data);
};
