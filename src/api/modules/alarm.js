import request from "@/utils/request";

export const getList = data => {
  return request.post("api/historyAlarms", data)
};

export const batchDelData = data => {
  return request.post("api/historyAlarmsDelete", data)
};

export const exprotData = (data, params) => {
  let txt = "";
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      txt += `${key}=${data[key]}&`      
    }
  }
  console.log('txt :>> ', txt);
  return request.get(`api/exportHistoryAlarms?${txt}`, params)
};
