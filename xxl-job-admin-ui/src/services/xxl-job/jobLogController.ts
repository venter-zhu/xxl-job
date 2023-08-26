// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /log/clearLog */
export async function clearLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clearLogParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/log/clearLog', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /log/logKill */
export async function logKill(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.logKillParams,
  options?: { [key: string]: any },
) {
  return request<API.ReturnTString>('/log/logKill', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /log/pageList */
export async function pageLogList(body: API.LogPageRequest, options?: { [key: string]: any }) {
  return request<API.ReturnTPageResultXxlJobLog>('/log/pageList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
