package com.xxl.job.admin.core.util;

/**
 * @author venter.zhu
 * @date 2023/8/22 15:59
 */
public class PageUtil {
    public static int getOffset(int current, int pageSize) {
        if (current < 1) {
            return 0;
        }
        return (current - 1) * pageSize;
    }
}
