// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /task/add */
export async function addTask(body: API.XxlJobInfo, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/task/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /task/nextTriggerTime */
export async function nextTriggerTime(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.nextTriggerTimeParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTListString>('/task/nextTriggerTime', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /task/queryPage */
export async function queryTaskPage(body: API.TaskPageRequest, options?: { [key: string]: any }) {
  return request<API.ReturnTPageResultXxlJobInfo>('/task/queryPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /task/remove */
export async function removeTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/task/remove', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /task/start */
export async function startTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.startTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/task/start', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /task/stop */
export async function stopTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.stopTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/task/stop', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /task/trigger */
export async function triggerTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.triggerTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/task/trigger', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /task/update */
export async function updateTask(body: API.XxlJobInfo, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/task/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
