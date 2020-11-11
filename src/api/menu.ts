import request from '../utils/request';

//分页获取权限列表
export function getMenuList(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params,
  });
}
//获取所有权限列表
export function getMenuAllList(params) {
  return request({
    url: '/menu/allList',
    method: 'get',
    params,
  });
}
// 更新权限信息
export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'put',
    data,
  });
}
// 删除权限
export function deleteMenu(params) {
  return request({
    url: '/menu/delete',
    method: 'delete',
    params,
  });
}
// 添加权限
export function createMenu(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data,
  });
}
