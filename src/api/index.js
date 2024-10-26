import request from '@/utils/request';

export * as API_HOME from '@/api/modules/login.js';

export const alogin = data => {
  return request.post("auth/login", data);
}