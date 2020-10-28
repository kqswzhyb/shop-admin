import request from '/@/utils/request.ts';
import { LoginConfig } from './interface';

export function loginByName(data: LoginConfig) {
    return request({
        url:'/login',
        method:'post',
        data
    })
}

export function printUser  (params: any) {
    return request({
        url:'/user/userExcel',
        method:'get',
        params,
        responseType: 'blob'
    });
} 
