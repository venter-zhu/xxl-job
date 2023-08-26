// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /jobgroup/add */
export async function addGroup(body: API.XxlJobGroup, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/jobgroup/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobgroup/loadById */
export async function loadGroupById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loadGroupByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTXxlJobGroup>('/jobgroup/loadById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobgroup/queryList */
export async function queryGroupList(options?: { [key: string]: any }) {
  return request<API.ReturnTListXxlJobGroup>('/jobgroup/queryList', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobgroup/queryPage */
export async function queryGroupPage(
  body: API.ExecutorPageRequest,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTPageResultXxlJobGroup>('/jobgroup/queryPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobgroup/remove */
export async function removeGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeGroupParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/jobgroup/remove', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobgroup/update */
export async function updateGroup(body: API.XxlJobGroup, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/jobgroup/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
