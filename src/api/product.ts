import request from '../utils/request';

//分页获取角色列表
export function getProductParameterList(params) {
  return request({
    url: '/product/parameterList',
    method: 'get',
    params,
  });
}
// 更新角色信息
export function updateProductParameter(data) {
  return request({
    url: '/product/updateParameter',
    method: 'put',
    data,
  });
}
// 删除角色
export function deleteProductParameter(params) {
  return request({
    url: '/product/deleteParameter',
    method: 'delete',
    params,
  });
}
// 添加角色
export function createProductParameter(data) {
  return request({
    url: '/product/saveParameter',
    method: 'post',
    data,
  });
}
