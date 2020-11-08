import request from '../utils/request';
import { LoginConfig } from './interface';

export function loginByName(data: LoginConfig) {
  return request({
    url: '/login',
    method: 'post',
    data,
  });
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  });
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get',
  });
}
