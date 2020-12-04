import request from '../utils/request';
import { LoginConfig } from './interface';

//登录
export function loginByName(data: LoginConfig) {
  return request({
    url: '/login',
    method: 'post',
    data,
  });
}
// 用户详情
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  });
}
//修改密码
export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'put',
    data,
  });
}
// 所有字典
export function getAllDic() {
  return request({
    url: '/dic/allList',
    method: 'get',
  });
}
//退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'get',
  });
}

//获取验证码
export function getCaptcha() {
  return request({
    url: '/captcha/new',
    method: 'get',
  });
}
