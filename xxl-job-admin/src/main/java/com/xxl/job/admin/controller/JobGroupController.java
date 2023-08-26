package com.xxl.job.admin.controller;

import com.xxl.job.admin.controller.request.ExecutorPageRequest;
import com.xxl.job.admin.controller.resolver.PageResult;
import com.xxl.job.admin.core.model.XxlJobGroup;
import com.xxl.job.admin.core.model.XxlJobRegistry;
import com.xxl.job.admin.core.util.I18nUtil;
import com.xxl.job.admin.core.util.PageUtil;
import com.xxl.job.admin.dao.XxlJobGroupDao;
import com.xxl.job.admin.dao.XxlJobInfoDao;
import com.xxl.job.admin.dao.XxlJobRegistryDao;
import com.xxl.job.admin.service.XxlJobService;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.enums.RegistryConfig;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;

/**
 * job group controller
 *
 * @author xuxueli 2016-10-02 20:52:56
 */
@Tag(name = "JobGroupController", description = "执行器管理类")
@RestController
@RequestMapping("/jobgroup")
public class JobGroupController {

    @Resource
    public XxlJobInfoDao xxlJobInfoDao;
    @Resource
    public XxlJobGroupDao xxlJobGroupDao;
    @Resource
    private XxlJobRegistryDao xxlJobRegistryDao;

    @Resource
    private XxlJobService xxlJobService;

    @GetMapping("/queryList")
    public ReturnT<List<XxlJobGroup>> queryGroupList() {
        List<XxlJobGroup> all = this.xxlJobGroupDao.findAll();
        return ReturnT.success(all);
    }


    @PostMapping("/queryPage")
    public ReturnT<PageResult<XxlJobGroup>> queryGroupPage(@RequestBody ExecutorPageRequest request) {
        if (Objects.isNull(request.getCurrent())) {
            request.setCurrent(1);
        }
        if (Objects.isNull(request.getPageSize())) {
            request.setPageSize(10);
        }
        int offset = PageUtil.getOffset(request.getCurrent(), request.getPageSize());
        List<XxlJobGroup> data = this.xxlJobGroupDao.pageList(offset, request.getPageSize(), request.getAppName(), request.getTitle());
        int total = this.xxlJobGroupDao.pageListCount(offset, request.getPageSize(), request.getAppName(), request.getTitle());
        PageResult<XxlJobGroup> result = new PageResult<>();
        result.setList(data);
        result.setTotal(total);
        result.setCurrent(request.getCurrent());
        result.setPageSize(request.getPageSize());
        return ReturnT.success(result);
    }

    @PostMapping("/add")
    @ResponseBody
    public ReturnT<String> addGroup(@RequestBody XxlJobGroup xxlJobGroup) {

        // valid
        ReturnT<String> stringReturnT = this.validGroup(xxlJobGroup);
        if (Objects.nonNull(stringReturnT)) {
            return stringReturnT;
        }
        // process
        xxlJobGroup.setUpdateTime(new Date());

        int ret = xxlJobGroupDao.save(xxlJobGroup);
        return (ret > 0) ? ReturnT.SUCCESS : ReturnT.FAIL;
    }

    @PostMapping("/update")
    @ResponseBody
    public ReturnT<String> updateGroup(@RequestBody XxlJobGroup xxlJobGroup) {
        // valid
        ReturnT<String> stringReturnT = this.validGroup(xxlJobGroup);
        if (Objects.nonNull(stringReturnT)) {
            return stringReturnT;
        }
        if (xxlJobGroup.getAddressType() == 0) {
            // 0=自动注册
            List<String> registryList = findRegistryByAppName(xxlJobGroup.getAppname());
            StringBuilder addressListStr = null;
            if (registryList != null && !registryList.isEmpty()) {
                Collections.sort(registryList);
                addressListStr = new StringBuilder();
                for (String item : registryList) {
                    addressListStr.append(item).append(",");
                }
                addressListStr = new StringBuilder(addressListStr.substring(0, addressListStr.length() - 1));
            }
            if (addressListStr != null) {
                xxlJobGroup.setAddressList(addressListStr.toString());
            }
        }
        // process
        xxlJobGroup.setUpdateTime(new Date());

        int ret = xxlJobGroupDao.update(xxlJobGroup);
        return (ret > 0) ? ReturnT.SUCCESS : ReturnT.FAIL;
    }

    private List<String> findRegistryByAppName(String appnameParam) {
        HashMap<String, List<String>> appAddressMap = new HashMap<String, List<String>>();
        List<XxlJobRegistry> list = xxlJobRegistryDao.findAll(RegistryConfig.DEAD_TIMEOUT, new Date());
        if (list != null) {
            for (XxlJobRegistry item : list) {
                if (RegistryConfig.RegistType.EXECUTOR.name().equals(item.getRegistryGroup())) {
                    String appname = item.getRegistryKey();
                    List<String> registryList = appAddressMap.get(appname);
                    if (registryList == null) {
                        registryList = new ArrayList<String>();
                    }

                    if (!registryList.contains(item.getRegistryValue())) {
                        registryList.add(item.getRegistryValue());
                    }
                    appAddressMap.put(appname, registryList);
                }
            }
        }
        return appAddressMap.get(appnameParam);
    }

    @GetMapping("/remove")
    @ResponseBody
    public ReturnT<String> removeGroup(int id) {
        // valid
        int count = xxlJobInfoDao.pageListCount(0, 10, id, -1, null, null, null);
        if (count > 0) {
            return new ReturnT<String>(500, I18nUtil.getString("jobgroup_del_limit_0"));
        }

        List<XxlJobGroup> allList = xxlJobGroupDao.findAll();
        if (allList.size() == 1) {
            return new ReturnT<String>(500, I18nUtil.getString("jobgroup_del_limit_1"));
        }

        int ret = xxlJobGroupDao.remove(id);
        return (ret > 0) ? ReturnT.SUCCESS : ReturnT.FAIL;
    }

    @GetMapping("/loadById")
    @ResponseBody
    public ReturnT<XxlJobGroup> loadGroupById(int id) {
        XxlJobGroup jobGroup = xxlJobGroupDao.load(id);
        return jobGroup != null ? new ReturnT<XxlJobGroup>(jobGroup) : new ReturnT<XxlJobGroup>(ReturnT.FAIL_CODE, null);
    }


    private ReturnT<String> validGroup(XxlJobGroup xxlJobGroup) {
        String appname = xxlJobGroup.getAppname();
        if (StringUtils.isBlank(appname)) {
            return new ReturnT<String>(500, (I18nUtil.getString("system_please_input") + "AppName"));
        }
        if (appname.length() < 4 || appname.length() > 64) {
            return new ReturnT<String>(500, I18nUtil.getString("jobgroup_field_appname_length"));
        }
        if (appname.contains(">") || appname.contains("<")) {
            return new ReturnT<String>(500, "AppName" + I18nUtil.getString("system_unvalid"));
        }
        String title = xxlJobGroup.getTitle();
        if (StringUtils.isBlank(title)) {
            return new ReturnT<String>(500, (I18nUtil.getString("system_please_input") + I18nUtil.getString("jobgroup_field_title")));
        }
        if (title.contains(">") || title.contains("<")) {
            return new ReturnT<String>(500, I18nUtil.getString("jobgroup_field_title") + I18nUtil.getString("system_unvalid"));
        }
        if (xxlJobGroup.getAddressType() != 0) {
            String addressList = xxlJobGroup.getAddressList();
            if (StringUtils.isBlank(addressList)) {
                return new ReturnT<String>(500, I18nUtil.getString("jobgroup_field_addressType_limit"));
            }
            if (addressList.contains(">") || addressList.contains("<")) {
                return new ReturnT<String>(500, I18nUtil.getString("jobgroup_field_registryList") + I18nUtil.getString("system_unvalid"));
            }
            String[] addresss = addressList.split(",");
            for (String item : addresss) {
                if (StringUtils.isBlank(item)) {
                    return new ReturnT<String>(500, I18nUtil.getString("jobgroup_field_registryList_unvalid"));
                }
            }
        }
        return null;
    }
}
