import request from '../utils/request';

//分页获取品牌列表
export function getBrandList(params) {
  return request({
    url: '/brand/list',
    method: 'get',
    params,
  });
}
// 更新品牌信息
export function updateBrand(data) {
  return request({
    url: '/brand/update',
    method: 'put',
    data,
  });
}
// 删除品牌
export function deleteBrand(params) {
  return request({
    url: '/brand/delete',
    method: 'delete',
    params,
  });
}
// 添加品牌
export function createBrand(data) {
  return request({
    url: '/brand/save',
    method: 'post',
    data,
  });
}
