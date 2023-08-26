package com.xxl.job.admin.controller;

import com.xxl.job.admin.controller.annotation.PermissionLimit;
import com.xxl.job.admin.controller.request.PasswordLoginRequest;
import com.xxl.job.admin.core.model.XxlJobUser;
import com.xxl.job.admin.service.LoginService;
import com.xxl.job.admin.service.XxlJobService;
import com.xxl.job.core.biz.model.ReturnT;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

/**
 * index controller
 *
 * @author xuxueli 2015-12-19 16:13:16
 */
@Controller
@Tag(name = "IndexController", description = "首页")
public class IndexController {

    @Resource
    private XxlJobService xxlJobService;
    @Resource
    private LoginService loginService;

    @GetMapping(value = "/")
    public String index() {
        return "index";
    }

    @Operation(summary = "报表", description = "报表")
    @GetMapping("/chartInfo")
    @ResponseBody
    public ReturnT<Map<String, Object>> chartInfo(Date startDate, Date endDate) {
        ReturnT<Map<String, Object>> chartInfo = xxlJobService.chartInfo(startDate, endDate);
        return chartInfo;
    }

    @PostMapping(value = "login")
    @ResponseBody
    @PermissionLimit(limit = false)
    @Operation(summary = "密码登录", description = "密码登录")
    public ReturnT<String> login(HttpServletRequest request, HttpServletResponse response, @RequestBody PasswordLoginRequest req) {
        return loginService.login(request, response, req.getUserName(), req.getPassword(), req.getIfRemember());
    }

    @PostMapping(value = "logout")
    @PermissionLimit(limit = false)
    @Operation(summary = "注销登录", description = "注销登录")
    @ResponseBody
    public ReturnT<String> logout(HttpServletRequest request, HttpServletResponse response) {
        return loginService.logout(request, response);
    }

    @GetMapping("isLogin")
    @PermissionLimit(limit = false)
    @ResponseBody
    @Operation(summary = "是否登录", description = "是否登录")
    public ReturnT<XxlJobUser> isLogin(HttpServletRequest request, HttpServletResponse response) {
        ReturnT<XxlJobUser> result = new ReturnT<>();

        XxlJobUser loginUser = loginService.isLogin(request, response);
        if (Objects.isNull(loginUser)) {
            result.setCode(401);
        } else {
            result.setCode(200);
        }
        result.setContent(loginUser);
        return result;
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }
}
