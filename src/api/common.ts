import request from '/@/utils/request.ts';
import { LoginConfig } from './interface';

export const loginByName = (data: LoginConfig) => request.post('/login', data);
