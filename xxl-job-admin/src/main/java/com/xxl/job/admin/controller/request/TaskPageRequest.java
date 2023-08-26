package com.xxl.job.admin.controller.request;

import lombok.Data;

/**
 * @author venter.zhu
 * @date 2023/7/28 16:53
 */
@Data
public class TaskPageRequest extends BasePageRequest {
    Integer jobGroup;
    Integer triggerStatus;
    String jobDesc;
    String executorHandler;
    String author;
}
