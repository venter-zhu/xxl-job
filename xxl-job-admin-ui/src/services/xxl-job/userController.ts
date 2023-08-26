// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /user/add */
export async function addUser(body: API.XxlJobUser, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/queryList */
export async function queryUserList(options?: { [key: string]: any }) {
  return request<API.ReturnTListXxlJobUser>('/user/queryList', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/queryPage */
export async function queryUserPage(body: API.UserPageRequest, options?: { [key: string]: any }) {
  return request<API.ReturnTPageResultXxlJobUser>('/user/queryPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/remove */
export async function removeUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeUserParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/user/remove', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/update */
export async function updateUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/user/update', {
    method: 'POST',
    params: {
      ...params,
      xxlJobUser: undefined,
      ...params['xxlJobUser'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/updatePwd */
export async function updateUserPwd(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserPwdParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/user/updatePwd', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
