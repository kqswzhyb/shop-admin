import request from '../utils/request';

//分页获取字典类型列表
export function getDicTypeList(params) {
  return request({
    url: '/dic/typeList',
    method: 'get',
    params,
  });
}
// 更新字典类型
export function updateDicType(data) {
  return request({
    url: '/dic/updateDicType',
    method: 'put',
    data,
  });
}
// 删除字典类型
export function deleteDicType(params) {
  return request({
    url: '/dic/deleteDicType',
    method: 'delete',
    params,
  });
}
// 添加字典类型
export function createDicType(data) {
  return request({
    url: '/dic/saveType',
    method: 'post',
    data,
  });
}

//分页获取字典列表
export function getDicList(params) {
  return request({
    url: '/dic/list',
    method: 'get',
    params,
  });
}
// 更新字典
export function updateDic(data) {
  return request({
    url: '/dic/updateDic',
    method: 'put',
    data,
  });
}
// 删除字典
export function deleteDic(params) {
  return request({
    url: '/dic/deleteDic',
    method: 'delete',
    params,
  });
}
// 添加字典
export function createDic(data) {
  return request({
    url: '/dic/save',
    method: 'post',
    data,
  });
}
