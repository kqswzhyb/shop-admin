import request from '/@/utils/request.ts';

export function getRoleList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
  });
}
