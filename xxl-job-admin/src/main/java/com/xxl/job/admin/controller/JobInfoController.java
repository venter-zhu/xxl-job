package com.xxl.job.admin.controller;

import com.xxl.job.admin.controller.request.TaskPageRequest;
import com.xxl.job.admin.controller.resolver.PageResult;
import com.xxl.job.admin.core.cron.CronExpression;
import com.xxl.job.admin.core.exception.XxlJobException;
import com.xxl.job.admin.core.model.XxlJobGroup;
import com.xxl.job.admin.core.model.XxlJobInfo;
import com.xxl.job.admin.core.model.XxlJobUser;
import com.xxl.job.admin.core.route.ExecutorRouteStrategyEnum;
import com.xxl.job.admin.core.scheduler.MisfireStrategyEnum;
import com.xxl.job.admin.core.scheduler.ScheduleTypeEnum;
import com.xxl.job.admin.core.thread.JobScheduleHelper;
import com.xxl.job.admin.core.thread.JobTriggerPoolHelper;
import com.xxl.job.admin.core.trigger.TriggerTypeEnum;
import com.xxl.job.admin.core.util.I18nUtil;
import com.xxl.job.admin.core.util.PageUtil;
import com.xxl.job.admin.dao.XxlJobGroupDao;
import com.xxl.job.admin.dao.XxlJobInfoDao;
import com.xxl.job.admin.service.LoginService;
import com.xxl.job.admin.service.XxlJobService;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.enums.ExecutorBlockStrategyEnum;
import com.xxl.job.core.glue.GlueTypeEnum;
import com.xxl.job.core.util.DateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.*;

/**
 * index controller
 * @author xuxueli 2015-12-19 16:13:16
 */
@RestController
@RequestMapping("/jobinfo")
public class JobInfoController {
	private static Logger logger = LoggerFactory.getLogger(JobInfoController.class);

	@Resource
	private XxlJobGroupDao xxlJobGroupDao;
	@Resource
	private XxlJobService xxlJobService;

	@Resource
	private XxlJobInfoDao xxlJobInfoDao;
	
	@RequestMapping
	public String index(HttpServletRequest request, Model model, @RequestParam(required = false, defaultValue = "-1") int jobGroup) {

		// 枚举-字典
		model.addAttribute("ExecutorRouteStrategyEnum", ExecutorRouteStrategyEnum.values());	    // 路由策略-列表
		model.addAttribute("GlueTypeEnum", GlueTypeEnum.values());								// Glue类型-字典
		model.addAttribute("ExecutorBlockStrategyEnum", ExecutorBlockStrategyEnum.values());	    // 阻塞处理策略-字典
		model.addAttribute("ScheduleTypeEnum", ScheduleTypeEnum.values());	    				// 调度类型
		model.addAttribute("MisfireStrategyEnum", MisfireStrategyEnum.values());	    			// 调度过期策略

		// 执行器列表
		List<XxlJobGroup> jobGroupList_all =  xxlJobGroupDao.findAll();

		// filter group
		List<XxlJobGroup> jobGroupList = filterJobGroupByRole(request, jobGroupList_all);
		if (jobGroupList==null || jobGroupList.size()==0) {
			throw new XxlJobException(I18nUtil.getString("jobgroup_empty"));
		}

		model.addAttribute("JobGroupList", jobGroupList);
		model.addAttribute("jobGroup", jobGroup);

		return "jobinfo/jobinfo.index";
	}

	public static List<XxlJobGroup> filterJobGroupByRole(HttpServletRequest request, List<XxlJobGroup> jobGroupList_all){
		List<XxlJobGroup> jobGroupList = new ArrayList<>();
		if (jobGroupList_all!=null && jobGroupList_all.size()>0) {
			XxlJobUser loginUser = (XxlJobUser) request.getAttribute(LoginService.LOGIN_IDENTITY_KEY);
			if (loginUser.getRole() == 1) {
				jobGroupList = jobGroupList_all;
			} else {
				List<String> groupIdStrs = new ArrayList<>();
				if (loginUser.getPermission()!=null && loginUser.getPermission().trim().length()>0) {
					groupIdStrs = Arrays.asList(loginUser.getPermission().trim().split(","));
				}
				for (XxlJobGroup groupItem:jobGroupList_all) {
					if (groupIdStrs.contains(String.valueOf(groupItem.getId()))) {
						jobGroupList.add(groupItem);
					}
				}
			}
		}
		return jobGroupList;
	}
	public static void validPermission(HttpServletRequest request, int jobGroup) {
		XxlJobUser loginUser = (XxlJobUser) request.getAttribute(LoginService.LOGIN_IDENTITY_KEY);
		if (!loginUser.validPermission(jobGroup)) {
			throw new RuntimeException(I18nUtil.getString("system_permission_limit") + "[username="+ loginUser.getUsername() +"]");
		}
	}

	@PostMapping("/queryPage")
	@ResponseBody
	public ReturnT<PageResult<XxlJobInfo>> queryTaskPage(@RequestBody TaskPageRequest request) {
		if (Objects.isNull(request.getCurrent())) {
			request.setCurrent(1);
		}
		if (Objects.isNull(request.getPageSize())) {
			request.setPageSize(10);
		}
		if (Objects.isNull(request.getJobGroup())) {
			request.setJobGroup(0);
		}
		if (Objects.isNull(request.getTriggerStatus())) {
			request.setTriggerStatus(-1);
		}
		int offset = PageUtil.getOffset(request.getCurrent(), request.getPageSize());
		List<XxlJobInfo> data = this.xxlJobInfoDao.pageList(offset, request.getPageSize(), request.getJobGroup(), request.getTriggerStatus(), request.getJobDesc(), request.getExecutorHandler(), request.getAuthor());
		int total = this.xxlJobInfoDao.pageListCount(offset, request.getPageSize(), request.getJobGroup(), request.getTriggerStatus(), request.getJobDesc(), request.getExecutorHandler(), request.getAuthor());
		PageResult<XxlJobInfo> result = new PageResult<>();
		result.setList(data);
		result.setTotal(total);
		result.setCurrent(request.getCurrent());
		result.setPageSize(request.getPageSize());
		return ReturnT.success(result);
	}

	@PostMapping("/add")
	public ReturnT<String> addTask(@RequestBody XxlJobInfo jobInfo) {
		return xxlJobService.add(jobInfo);
	}

	@PostMapping("/update")
	@ResponseBody
	public ReturnT<String> updateTask(@RequestBody XxlJobInfo jobInfo) {
		return xxlJobService.update(jobInfo);
	}

	@GetMapping("/remove")
	@ResponseBody
	public ReturnT<String> removeTask(@RequestParam("id") int id) {
		return xxlJobService.remove(id);
	}

	@GetMapping("/stop")
	@ResponseBody
	public ReturnT<String> stopTask(@RequestParam("id") int id) {
		return xxlJobService.stop(id);
	}

	@GetMapping("/start")
	@ResponseBody
	public ReturnT<String> startTask(@RequestParam("id") int id) {
		return xxlJobService.start(id);
	}

	@PostMapping("/trigger")
	public ReturnT<String> triggerTask(@RequestParam("id") int id, @RequestParam("executorParam") String executorParam, @RequestParam("addressList") String addressList) {
		// force cover job param
		if (executorParam == null) {
			executorParam = "";
		}

		JobTriggerPoolHelper.trigger(id, TriggerTypeEnum.MANUAL, -1, null, executorParam, addressList);
		return ReturnT.SUCCESS;
	}

	@GetMapping("/nextTriggerTime")
	public ReturnT<List<String>> nextTriggerTime(@RequestParam("scheduleType") String scheduleType, @RequestParam("scheduleConf") String scheduleConf) {

		XxlJobInfo paramXxlJobInfo = new XxlJobInfo();
		paramXxlJobInfo.setScheduleType(scheduleType);
		paramXxlJobInfo.setScheduleConf(scheduleConf);

		List<String> result = new ArrayList<>();
		try {
			Date lastTime = new Date();
			for (int i = 0; i < 5; i++) {
				lastTime = JobScheduleHelper.generateNextValidTime(paramXxlJobInfo, lastTime);
				if (lastTime != null) {
					result.add(DateUtil.formatDateTime(lastTime));
				} else {
					break;
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ReturnT.fail(I18nUtil.getString("schedule_type") + I18nUtil.getString("system_unvalid") + e.getMessage());
		}
		return ReturnT.success(result);

	}
	
}
