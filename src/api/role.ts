import request from '../utils/request';

//分页获取角色列表
export function getRoleList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
  });
}
// 更新角色信息
export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'put',
    data,
  });
}
// 删除角色
export function deleteRole(params) {
  return request({
    url: '/role/delete',
    method: 'delete',
    params,
  });
}
// 添加角色
export function createRole(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data,
  });
}
