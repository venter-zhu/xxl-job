package com.xxl.job.admin.controller.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * @author venter.zhu
 * @date 2023/8/18 09:33
 */
@Data
public class BasePageRequest {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Integer current;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Integer pageSize;
}
