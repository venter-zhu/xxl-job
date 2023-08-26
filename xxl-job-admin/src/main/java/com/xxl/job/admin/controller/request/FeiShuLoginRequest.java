package com.xxl.job.admin.controller.request;

/**
 * @author venter.zhu
 * @date 2022/12/15 11:25
 */

import lombok.Data;

import java.io.Serializable;

@Data
public class FeiShuLoginRequest implements Serializable {

    private String grant_type = "authorization_code";
    private String client_id;
    private String client_secret;
    private String code;
    private String redirect_uri;
}
