package com.xxl.job.admin.controller.request;

import lombok.Data;

/**
 * @author venter.zhu
 * @date 2023/8/4 14:51
 */
@Data
public class ExecutorPageRequest extends BasePageRequest {
    String appName;
    String title;
}
