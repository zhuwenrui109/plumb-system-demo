import request from '@/utils/request';

export const login = data => {
  return request.post("api/auth/login", data);
}