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
 * 操作云台上下左右
 * @param {Object} data 
 * @returns 
 */
export const handleDirection = (data) => request.post("api/direction", data);
