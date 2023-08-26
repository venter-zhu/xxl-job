package com.xxl.job.admin.controller.request;

import lombok.Data;

/**
 * @author venter.zhu
 * @date 2023/8/18 09:40
 */
@Data
public class UserPageRequest extends BasePageRequest {
    String username;
    Integer role;
}
