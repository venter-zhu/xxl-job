// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 报表 报表 GET /chartInfo */
export async function chartInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.chartInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTMapStringObject>('/chartInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 是否登录 是否登录 GET /isLogin */
export async function isLogin(options?: { [key: string]: any }) {
  return request<API.ReturnTXxlJobUser>('/isLogin', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 密码登录 密码登录 POST /login */
export async function login(body: API.PasswordLoginRequest, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注销登录 注销登录 POST /logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
