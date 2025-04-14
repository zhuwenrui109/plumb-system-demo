import request from '@/utils/request';

/**
 * 登录
 * @param {Object} data 数据
 * @returns Promise
 */
export const login = data => {
  return request.post("api/auth/login", data);
}

/**
 * 获取场站列表
 * @returns Promise
 */
export const getStandList = () => request.post("api/index");

/**
 * 保存设置
 * @param {Object} data 
 * @returns 
 */
export const saveSetting = (data) => request.post("api/configStore", data);

/**
 * 获取窗口数量
 * @returns 
 */
export const getWindowCount = () => request.get("api/config/windows_number");

/**
 * 控制云台上下左右
 * @returns 
 */
export const handleDirection = data => request.post("api/direction", data);

/**
 * 控制云台速度
 * @returns 
 */
export const handleSpeed = data => request.post("api/speed", data);

/**
 * 报警消音
 * @returns 
 */
export const alarmMuted = data => request.post("api/mute", data);

/**
 * 报警消音
 * @returns 
 */
export const submitCheckAlarm = data => request.post("api/confirmAlarm", data);

/**
 * 控制雨刷
 * @returns 
 */
export const handleWiper = data => request.post("api/wiper", data);

/**
 * 获取是否正在自动巡航中
 * @returns 
 */
export const getAutoStatus = data => request.post("api/cruiseStatus", data);

/**
 * 关闭自动巡航
 * @returns 
 */
export const closeAuto = data => request.post("api/cruiseClose", data);

/**
 * 用户信息
 * @returns 
 */
export const getUserInfo = () => request.get("api/auth/currentUser");

/**
 * 全部场站
 * @returns 
 */
export const getAllStand = () => request.get("api/getAllStations");

/**
 * 全部场站
 * @returns 
 */
export const getAllArea = id => request.get(`api/getAllRegions/${id}`);

/**
 * 全部场站
 * @returns 
 */
export const startContrl = data => request.post(`api/contrl`, data);

/**
 * 全部场站
 * @returns 
 */
export const getSdkFile = () => request.get(`sdk/HCWebSDKPlugin.exe`, { responseType: 'blob' });

/**
 * 全部场站
 * @returns 
 */
// export const getAudio = () => request.get(`resource/alarm.mp3`, { responseType: 'blob' });

/**
 * 全部场站
 * @returns 
 */
export const getRealAlarm = data => request.post(`api/alarms`, data);

/**
 * 全部场站
 * @returns 
 */
export const checkRealAlarm = data => request.post(`api/confirmSelectedAlarm`, data);

/**
 * 全部场站
 * @returns 
 */
export const checkRealAlarmVideo = data => request.post(`api/alarmVideo`, data);