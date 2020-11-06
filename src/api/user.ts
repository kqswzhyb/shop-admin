import request from '/@/utils/request.ts';

//分页获取用户列表
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  });
}
// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data,
  });
}
// 删除用户
export function deleteUser(params) {
  return request({
    url: '/user/delete',
    method: 'delete',
    params,
  });
}
