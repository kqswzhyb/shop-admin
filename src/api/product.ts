import request from '../utils/request';

//分页获取参数列表
export function getProductParameterList(params) {
  return request({
    url: '/product/parameterList',
    method: 'get',
    params,
  });
}
// 更新参数信息
export function updateProductParameter(data) {
  return request({
    url: '/product/updateParameter',
    method: 'put',
    data,
  });
}
// 删除参数
export function deleteProductParameter(params) {
  return request({
    url: '/product/deleteParameter',
    method: 'delete',
    params,
  });
}
// 添加参数
export function createProductParameter(data) {
  return request({
    url: '/product/saveParameter',
    method: 'post',
    data,
  });
}


//分页获取产品列表
export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params,
  });
}
// 更新产品信息
export function updateProduct(data) {
  return request({
    url: '/product/update',
    method: 'put',
    data,
  });
}
// 删除产品
export function deleteProduct(params) {
  return request({
    url: '/product/delete',
    method: 'delete',
    params,
  });
}
// 添加产品
export function createProduct(data) {
  return request({
    url: '/product/save',
    method: 'post',
    data,
  });
}

//分页获取产品组员列表
export function getProductgList(params) {
  return request({
    url: '/product/productgList',
    method: 'get',
    params,
  });
}
// 更新产品组员库存信息
export function updateProductgStock(data) {
  return request({
    url: '/product/updateProductStock',
    method: 'put',
    data,
  });
}
// 更新产品上架状态
export function updateProductSaleStatus(data) {
  return request({
    url: '/product/updateSaleStatus',
    method: 'put',
    data,
  });
}
