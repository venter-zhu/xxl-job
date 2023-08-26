package com.xxl.job.admin.controller.resolver;

import lombok.Data;

import java.util.List;

/**
 * @author venter.zhu
 * @date 2023/8/22 16:43
 */
@Data
public class PageResult<T> {
    List<T> list;
    Integer total;
    Integer current;
    Integer pageSize;

}
