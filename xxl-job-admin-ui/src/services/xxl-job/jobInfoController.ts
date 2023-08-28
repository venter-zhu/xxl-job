// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /jobinfo */
export async function index(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.indexParams,
  options?: { [key: string]: any },
) {
  return request<string>('/jobinfo', {
    method: 'GET',
    params: {
      // jobGroup has a default value: -1
      jobGroup: '-1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /jobinfo */
export async function index3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.index3Params,
  options?: { [key: string]: any },
) {
  return request<string>('/jobinfo', {
    method: 'PUT',
    params: {
      // jobGroup has a default value: -1
      jobGroup: '-1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobinfo */
export async function index2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.index2Params,
  options?: { [key: string]: any },
) {
  return request<string>('/jobinfo', {
    method: 'POST',
    params: {
      // jobGroup has a default value: -1
      jobGroup: '-1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /jobinfo */
export async function index5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.index5Params,
  options?: { [key: string]: any },
) {
  return request<string>('/jobinfo', {
    method: 'DELETE',
    params: {
      // jobGroup has a default value: -1
      jobGroup: '-1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /jobinfo */
export async function index4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.index4Params,
  options?: { [key: string]: any },
) {
  return request<string>('/jobinfo', {
    method: 'PATCH',
    params: {
      // jobGroup has a default value: -1
      jobGroup: '-1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobinfo/add */
export async function addTask(body: API.XxlJobInfo, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/jobinfo/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobinfo/nextTriggerTime */
export async function nextTriggerTime(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.nextTriggerTimeParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTListString>('/jobinfo/nextTriggerTime', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobinfo/queryPage */
export async function queryTaskPage(body: API.TaskPageRequest, options?: { [key: string]: any }) {
  return request<API.ReturnTPageResultXxlJobInfo>('/jobinfo/queryPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobinfo/remove */
export async function removeTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/jobinfo/remove', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobinfo/start */
export async function startTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.startTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/jobinfo/start', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /jobinfo/stop */
export async function stopTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.stopTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/jobinfo/stop', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobinfo/trigger */
export async function triggerTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.triggerTaskParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/jobinfo/trigger', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /jobinfo/update */
export async function updateTask(body: API.XxlJobInfo, options?: { [key: string]: any }) {
  return request<API.ReturnTString>('/jobinfo/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
