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
