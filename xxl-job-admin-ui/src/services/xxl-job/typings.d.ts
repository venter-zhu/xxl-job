declare namespace API {
  type apiParams = {
    uri: string;
  };

  type chartInfoParams = {
    startDate: string;
    endDate: string;
  };

  type clearLogParams = {
    jobGroup: number;
    jobId: number;
    type: number;
  };

  type ExecutorPageRequest = {
    current: number;
    pageSize: number;
    appName?: string;
    title?: string;
  };

  type loadGroupByIdParams = {
    id: number;
  };

  type logKillParams = {
    id: number;
  };

  type LogPageRequest = {
    current: number;
    pageSize: number;
    jobGroup?: number;
    jobId?: number;
    logStatus?: number;
    filterTime?: string;
  };

  type nextTriggerTimeParams = {
    scheduleType: string;
    scheduleConf: string;
  };

  type PageResultXxlJobGroup = {
    list?: XxlJobGroup[];
    total?: number;
    current?: number;
    pageSize?: number;
  };

  type PageResultXxlJobInfo = {
    list?: XxlJobInfo[];
    total?: number;
    current?: number;
    pageSize?: number;
  };

  type PageResultXxlJobLog = {
    list?: XxlJobLog[];
    total?: number;
    current?: number;
    pageSize?: number;
  };

  type PageResultXxlJobUser = {
    list?: XxlJobUser[];
    total?: number;
    current?: number;
    pageSize?: number;
  };

  type PasswordLoginRequest = {
    /** 账号 */
    userName?: string;
    /** 密码 */
    password?: string;
    /** 是否记住我 */
    ifRemember?: boolean;
  };

  type removeGroupParams = {
    id: number;
  };

  type removeTaskParams = {
    id: number;
  };

  type removeUserParams = {
    id: number;
  };

  type ReturnTListString = {
    code?: number;
    msg?: string;
    content?: string[];
  };

  type ReturnTListXxlJobGroup = {
    code?: number;
    msg?: string;
    content?: XxlJobGroup[];
  };

  type ReturnTListXxlJobUser = {
    code?: number;
    msg?: string;
    content?: XxlJobUser[];
  };

  type ReturnTMapStringObject = {
    code?: number;
    msg?: string;
    content?: Record<string, any>;
  };

  type ReturnTPageResultXxlJobGroup = {
    code?: number;
    msg?: string;
    content?: PageResultXxlJobGroup;
  };

  type ReturnTPageResultXxlJobInfo = {
    code?: number;
    msg?: string;
    content?: PageResultXxlJobInfo;
  };

  type ReturnTPageResultXxlJobLog = {
    code?: number;
    msg?: string;
    content?: PageResultXxlJobLog;
  };

  type ReturnTPageResultXxlJobUser = {
    code?: number;
    msg?: string;
    content?: PageResultXxlJobUser;
  };

  type ReturnTString = {
    code?: number;
    msg?: string;
    content?: string;
  };

  type ReturnTXxlJobGroup = {
    code?: number;
    msg?: string;
    content?: XxlJobGroup;
  };

  type ReturnTXxlJobUser = {
    code?: number;
    msg?: string;
    content?: XxlJobUser;
  };

  type saveCodeParams = {
    id: number;
    glueSource: string;
    glueRemark: string;
  };

  type startTaskParams = {
    id: number;
  };

  type stopTaskParams = {
    id: number;
  };

  type TaskPageRequest = {
    current: number;
    pageSize: number;
    jobGroup?: number;
    triggerStatus?: number;
    jobDesc?: string;
    executorHandler?: string;
    author?: string;
  };

  type triggerTaskParams = {
    id: number;
    executorParam: string;
    addressList: string;
  };

  type updateUserParams = {
    xxlJobUser: XxlJobUser;
  };

  type updateUserPwdParams = {
    password: string;
  };

  type UserPageRequest = {
    current: number;
    pageSize: number;
    username?: string;
    role?: number;
  };

  type XxlJobGroup = {
    id?: number;
    /** 执行器的AppName */
    appname: string;
    /** 执行器昵称 */
    title?: string;
    /** 注册类型，0=自动注册、1=手动录入 */
    addressType?: number;
    /** 执行器地址列表 */
    addressList?: string;
    updateTime?: string;
    registryList?: string[];
  };

  type XxlJobInfo = {
    id?: number;
    jobGroup?: number;
    jobDesc?: string;
    addTime?: string;
    updateTime?: string;
    author?: string;
    alarmEmail?: string;
    scheduleType?: string;
    scheduleConf?: string;
    misfireStrategy?: string;
    executorRouteStrategy?: string;
    executorHandler?: string;
    executorParam?: string;
    executorBlockStrategy?: string;
    executorTimeout?: number;
    executorFailRetryCount?: number;
    glueType?: string;
    glueSource?: string;
    glueRemark?: string;
    glueUpdatetime?: string;
    childJobId?: string;
    triggerStatus?: number;
    triggerLastTime?: number;
    triggerNextTime?: number;
    webhook?: number;
    unionId?: string;
  };

  type XxlJobLog = {
    id?: number;
    jobGroup?: number;
    jobId?: number;
    executorAddress?: string;
    executorHandler?: string;
    executorParam?: string;
    executorShardingParam?: string;
    executorFailRetryCount?: number;
    triggerTime?: string;
    triggerCode?: number;
    triggerMsg?: string;
    handleTime?: string;
    handleCode?: number;
    handleMsg?: string;
    alarmStatus?: number;
  };

  type XxlJobUser = {
    id?: number;
    username?: string;
    password?: string;
    role?: number;
    permission?: string;
    unionId?: string;
  };
}
