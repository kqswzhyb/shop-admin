import request from '/@/utils/request.ts';

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  });
}
