package com.xxl.job.admin.controller.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * @author venter.zhu
 * @date 2023/8/17 17:29
 */
@Schema(name = "PasswordLoginRequest", description = "账号密码登录请求参数")
@Data
public class PasswordLoginRequest {
    @Schema(name = "userName", description = "账号")
    String userName;
    @Schema(name = "password", description = "密码")
    String password;
    @Schema(name = "ifRemember", description = "是否记住我")
    Boolean ifRemember;
}
