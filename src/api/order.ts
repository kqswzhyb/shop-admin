import request from '../utils/request';

//分页获取订单列表
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params,
  });
}
// 更新订单信息
export function updateOrder(data) {
  return request({
    url: '/order/updateOrder',
    method: 'put',
    data,
  });
}
// 更新订单状态
export function updateStatus(data) {
  return request({
    url: '/order/updateStatus',
    method: 'put',
    data,
  });
}
