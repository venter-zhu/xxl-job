package com.xxl.job.admin.controller.request;

import lombok.Data;

/**
 * @author venter.zhu
 * @date 2023/8/18 09:51
 */
@Data
public class LogPageRequest extends BasePageRequest {
    int jobGroup;
    int jobId;
    int logStatus;
    String filterTime;
}
