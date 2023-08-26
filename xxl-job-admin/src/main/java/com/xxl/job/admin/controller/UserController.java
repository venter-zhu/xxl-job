package com.xxl.job.admin.controller;

import com.xxl.job.admin.controller.annotation.PermissionLimit;
import com.xxl.job.admin.controller.request.UserPageRequest;
import com.xxl.job.admin.controller.resolver.PageResult;
import com.xxl.job.admin.core.model.XxlJobUser;
import com.xxl.job.admin.core.util.I18nUtil;
import com.xxl.job.admin.core.util.PageUtil;
import com.xxl.job.admin.dao.XxlJobUserDao;
import com.xxl.job.admin.service.LoginService;
import com.xxl.job.core.biz.model.ReturnT;
import org.springframework.util.CollectionUtils;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Objects;

/**
 * @author xuxueli 2019-05-04 16:39:50
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private LoginService loginService;
    @Resource
    private XxlJobUserDao xxlJobUserDao;

    @GetMapping("/queryList")
    public ReturnT<List<XxlJobUser>> queryUserList() {
        List<XxlJobUser> all = this.xxlJobUserDao.pageList(0,100,null,-1);
        return ReturnT.success(all);
    }


    @PostMapping("/queryPage")
    @PermissionLimit(adminuser = true)
    public ReturnT<PageResult<XxlJobUser>> queryUserPage(@RequestBody UserPageRequest request) {
        // page list
        if (Objects.isNull(request.getCurrent())) {
            request.setCurrent(1);
        }
        if (Objects.isNull(request.getPageSize())) {
            request.setPageSize(10);
        }
        if (Objects.isNull(request.getRole())) {
            request.setRole(-1);
        }
        int offset = PageUtil.getOffset(request.getCurrent(), request.getPageSize());
        List<XxlJobUser> xxlJobUsers = xxlJobUserDao.pageList(offset, request.getPageSize(), request.getUsername(), request.getRole());
        int total = xxlJobUserDao.pageListCount(offset, request.getPageSize(), request.getUsername(), request.getRole());
        // filter
        if (!CollectionUtils.isEmpty(xxlJobUsers)) {
            for (XxlJobUser item : xxlJobUsers) {
                item.setPassword(null);
            }
        }
        PageResult<XxlJobUser> result = new PageResult<>();
        result.setList(xxlJobUsers);
        result.setTotal(total);
        result.setCurrent(request.getCurrent());
        result.setPageSize(request.getPageSize());
        return ReturnT.success(result);
    }

    @PostMapping("/add")
    @PermissionLimit(adminuser = true)
    public ReturnT<String> addUser(@RequestBody XxlJobUser xxlJobUser) {

        // valid username
        if (!StringUtils.hasText(xxlJobUser.getUsername())) {
            return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("system_please_input") + I18nUtil.getString("user_username"));
        }
        xxlJobUser.setUsername(xxlJobUser.getUsername().trim());
        if (!(xxlJobUser.getUsername().length() >= 4 && xxlJobUser.getUsername().length() <= 20)) {
            return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("system_lengh_limit") + "[4-20]");
        }
        // valid password
        if (!StringUtils.hasText(xxlJobUser.getPassword())) {
            return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("system_please_input") + I18nUtil.getString("user_password"));
        }
        xxlJobUser.setPassword(xxlJobUser.getPassword().trim());
        if (!(xxlJobUser.getPassword().length() >= 4 && xxlJobUser.getPassword().length() <= 20)) {
            return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("system_lengh_limit") + "[4-20]");
        }
        // md5 password
        xxlJobUser.setPassword(DigestUtils.md5DigestAsHex(xxlJobUser.getPassword().getBytes()));

        // check repeat
        XxlJobUser existUser = xxlJobUserDao.loadByUserName(xxlJobUser.getUsername());
        if (existUser != null) {
            return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("user_username_repeat"));
        }

        // write
        xxlJobUserDao.save(xxlJobUser);
        return ReturnT.SUCCESS;
    }

    @PostMapping("/update")
    @PermissionLimit(adminuser = true)
    public ReturnT<String> updateUser(HttpServletRequest request, XxlJobUser xxlJobUser) {

        // avoid opt login seft
        XxlJobUser loginUser = (XxlJobUser) request.getAttribute(LoginService.LOGIN_IDENTITY_KEY);
        if (loginUser.getUsername().equals(xxlJobUser.getUsername())) {
            return new ReturnT<String>(ReturnT.FAIL.getCode(), I18nUtil.getString("user_update_loginuser_limit"));
        }

        // valid password
        if (StringUtils.hasText(xxlJobUser.getPassword())) {
            xxlJobUser.setPassword(xxlJobUser.getPassword().trim());
            if (!(xxlJobUser.getPassword().length() >= 4 && xxlJobUser.getPassword().length() <= 20)) {
                return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("system_lengh_limit") + "[4-20]");
            }
            // md5 password
            xxlJobUser.setPassword(DigestUtils.md5DigestAsHex(xxlJobUser.getPassword().getBytes()));
        } else {
            xxlJobUser.setPassword(null);
        }

        // write
        xxlJobUserDao.update(xxlJobUser);
        return ReturnT.SUCCESS;
    }

    @GetMapping("/remove")
    @PermissionLimit(adminuser = true)
    public ReturnT<String> removeUser(HttpServletRequest request, HttpServletResponse response, int id) {

        // avoid opt login seft
        XxlJobUser loginUser = loginService.ifLogin(request, response);
        if (Objects.nonNull(loginUser) && loginUser.getId() == id) {
            return ReturnT.FAIL;
        }

        xxlJobUserDao.delete(id);
        return ReturnT.SUCCESS;
    }

    @GetMapping("/updatePwd")
    public ReturnT<String> updateUserPwd(HttpServletRequest request, String password) {

        // valid password
        if (password == null || password.trim().length() == 0) {
            return new ReturnT<String>(ReturnT.FAIL.getCode(), "密码不可为空");
        }
        password = password.trim();
        if (!(password.length() >= 4 && password.length() <= 20)) {
            return new ReturnT<String>(ReturnT.FAIL_CODE, I18nUtil.getString("system_lengh_limit") + "[4-20]");
        }

        // md5 password
        String md5Password = DigestUtils.md5DigestAsHex(password.getBytes());

        // update pwd
        XxlJobUser loginUser = (XxlJobUser) request.getAttribute(LoginService.LOGIN_IDENTITY_KEY);

        // do write
        XxlJobUser existUser = xxlJobUserDao.loadByUserName(loginUser.getUsername());
        existUser.setPassword(md5Password);
        xxlJobUserDao.update(existUser);

        return ReturnT.SUCCESS;
    }

}
