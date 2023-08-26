// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/${param0} */
export async function api(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.apiParams,
  body: string,
  options?: { [key: string]: any },
) {
  const { uri: param0, ...queryParams } = params;
  return request<API.ReturnTString>(`/api/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
