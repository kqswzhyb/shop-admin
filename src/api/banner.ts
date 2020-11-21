import request from '../utils/request';

//分页获取轮播图列表
export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params,
  });
}
// 更新轮播图信息
export function updateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'put',
    data,
  });
}
// 删除轮播图
export function deleteBanner(params) {
  return request({
    url: '/banner/delete',
    method: 'delete',
    params,
  });
}
// 添加轮播图
export function createBanner(data) {
  return request({
    url: '/banner/save',
    method: 'post',
    data,
  });
}
