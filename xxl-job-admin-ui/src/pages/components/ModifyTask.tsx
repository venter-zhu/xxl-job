import { queryGroupList } from '@/services/xxl-job/JobGroupController';
import { queryUserList } from '@/services/xxl-job/userController';
import { SettingOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Divider, Popover } from 'antd';
import React, { useRef, useState } from 'react';
import CronGenerator from './CronGenerator';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.XxlJobInfo) => void;
  onSubmit: (values: API.XxlJobInfo) => Promise<void>;
  open: boolean;
  values?: API.XxlJobInfo;
  title?: string;
};

const authorSelect = async () => {
  let data: API.XxlJobUser[] | undefined = (await queryUserList()).content;
  let options = [];
  if (data) {
    for (let item of data) {
      options.push({ label: item.username, value: item.username });
    }
  }
  return options;
};

const groupSelect = async () => {
  let data: API.XxlJobGroup[] | undefined = (await queryGroupList()).content;
  let options = [];
  if (data) {
    for (let item of data) {
      options.push({ label: item.title, value: item.id });
    }
  }
  return options;
};

const ModifyTask: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const defaultGlueType = props.values ? props.values.glueType : 'BEAN';
  const defaultScheduleType = props.values
    ? props.values.scheduleType
      ? props.values.scheduleType
      : ''
    : 'CRON';

  const [showJobHandler, setShowJobHandler] = useState<boolean>(defaultGlueType == 'BEAN');
  const [showConf, setShowConf] = useState<string>(defaultScheduleType);

  const form = useRef<ProFormInstance>();
  const [cronConfigOpen, setCronConfigOpen] = useState<boolean>(false);
  const [cronVal, setCronVal] = useState<string>();

  // useEffect(() => {
  //   if (!props.values && showConf === 'CRON') {
  //     form.current?.setFieldValue('scheduleConf', cronVal);
  //   }
  // }, [cronVal, showConf]);
  return (
    <ModalForm
      width={860}
      layout="horizontal"
      grid={true}
      formRef={form}
      title={props.values?.id ? '编辑任务' : '新增任务'}
      open={props.open}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        onCancel: () => {
          setCronConfigOpen(false);
          setCronVal(undefined);
          props.onCancel();
        },
      }}
      submitter={{
        searchConfig: {
          submitText: '保存',
          resetText: '取消',
        },
      }}
      initialValues={{
        ...props.values,
        glueType: defaultGlueType,
        scheduleType: defaultScheduleType,
        misfireStrategy: props.values ? props.values.misfireStrategy : 'DO_NOTHING',
        executorRouteStrategy: props.values ? props.values.executorRouteStrategy : 'FIRST',
        executorBlockStrategy: props.values
          ? props.values.executorBlockStrategy
          : 'SERIAL_EXECUTION',
        executorFailRetryCount: props.values ? props.values.executorFailRetryCount : 0,
        executorTimeout: props.values ? props.values.executorTimeout : 0,
      }}
      submitTimeout={2000}
      onFinish={props.onSubmit}
    >
      <ProFormText name="id" hidden />
      <Divider style={{ color: '#86909c' }} orientation="left" plain>
        基本信息
      </Divider>
      <ProForm.Group>
        <ProFormSelect
          name="jobGroup"
          label="执行器"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          request={groupSelect}
          rules={[{ required: true, message: '请选择执行器' }]}
        />
        <ProFormText
          name="jobDesc"
          label="任务描述"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          rules={[{ required: true, message: '请输入任务描述' }]}
        />
        <ProFormSelect
          name="author"
          label="负责人"
          showSearch
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          request={authorSelect}
          rules={[{ required: true, message: '请输入负责人' }]}
        />
        <ProFormSelect
          mode="multiple"
          label="告警配置"
          labelCol={{ span: 3 }}
          fieldProps={{ defaultValue: [7] }}
          request={async () => [
            { value: 1, label: '钉钉-告警二群' },
            { value: 2, label: '告警一群' },
            { value: 3, label: '告警财务群' },
            { value: 4, label: '告警研发群' },
            { value: 5, label: '告警总群' },
            { value: 6, label: '飞书-告警一群' },
            { value: 7, label: '邮件-运维群' },
          ]}
        />
      </ProForm.Group>
      <Divider style={{ color: '#86909c' }} orientation="left" plain>
        调度配置
      </Divider>
      <ProFormSelect
        name="scheduleType"
        label={intl.formatMessage({
          id: 'task.scheduleType',
          defaultMessage: 'Scheduling Type',
        })}
        onChange={(val: string) => {
          setShowConf(val);
          if (val !== defaultScheduleType) {
            form?.current?.setFieldValue('scheduleConf', undefined);
          } else {
            form?.current?.setFieldValue('scheduleConf', props.values?.scheduleConf);
          }
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        colProps={{ xl: 12 }}
        request={async () => [
          { value: 'NONE', label: '无' },
          { value: 'CRON', label: 'CRON' },
          {
            value: 'FIX_RATE',
            label: <FormattedMessage id="task.scheduleFixRate" defaultMessage="Fix Rate" />,
          },
        ]}
      />
      {showConf && showConf === 'CRON' && (
        <ProFormText
          name="scheduleConf"
          label="Cron"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          placeholder="cron表达式..."
          rules={[{ required: true, message: '请输入cron表达式' }]}
          fieldProps={{
            addonAfter: (
              <>
                <SettingOutlined onClick={() => setCronConfigOpen(!cronConfigOpen)} />
                <Popover
                  content={
                    <CronGenerator
                      val={form.current?.getFieldValue('scheduleConf')}
                      setVal={(val) => {
                        form.current?.setFieldValue('scheduleConf', val);
                      }}
                    />
                  }
                  open={cronConfigOpen}
                  placement="bottom"
                />
              </>
            ),
          }}
        />
      )}
      {showConf && showConf === 'FIX_RATE' && (
        <ProFormText
          name="scheduleConf"
          label="固定速度"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          placeholder="请输入（Second）"
          rules={[{ required: true, min: 1, message: '请输入值' }]}
        />
      )}
      <Divider style={{ color: '#86909c' }} orientation="left" plain>
        运行时配置
      </Divider>
      <ProForm.Group>
        <ProFormSelect
          name="glueType"
          label={intl.formatMessage({
            id: 'task.glueType',
            defaultMessage: '运行模式',
          })}
          onChange={(val) => {
            if (val === 'BEAN') {
              setShowJobHandler(true);
            } else {
              setShowJobHandler(false);
            }
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          request={async () => [
            { value: 'BEAN', label: 'BEAN' },
            { value: 'GLUE_GROOVY', label: 'GLUE(Java)' },
            { value: 'GLUE_SHELL', label: 'GLUE(Shell)' },
            { value: 'GLUE_PYTHON', label: 'GLUE(Python)' },
            { value: 'GLUE_PHP', label: 'GLUE(PHP)' },
            { value: 'GLUE_NODEJS', label: 'GLUE(Nodejs)' },
            { value: 'GLUE_POWERSHELL', label: 'GLUE(PowerShell)' },
          ]}
        />
        {showJobHandler && (
          <ProFormText
            name="executorHandler"
            label={intl.formatMessage({ id: 'task.jobHandler', defaultMessage: 'JobHandler' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            colProps={{ xl: 12 }}
            placeholder="请输入JobHandler"
            rules={[{ required: true, message: '请输入JobHandler' }]}
          />
        )}
        <ProFormTextArea
          name="executorParam"
          labelCol={{ span: 3 }}
          label={intl.formatMessage({
            id: 'task.jobParam',
            defaultMessage: '任务参数',
          })}
          placeholder={intl.formatMessage({
            id: 'task.jobParam.placeholder',
            defaultMessage: '请输入任务参数',
          })}
        />
      </ProForm.Group>
      <Divider style={{ color: '#86909c' }} orientation="left" plain>
        高级配置
      </Divider>
      <ProForm.Group>
        <ProFormSelect
          name="executorRouteStrategy"
          label="路由策略"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          request={async () => [
            { value: 'FIRST', label: '第一个' },
            { value: 'LAST', label: '最后一个' },
            { value: 'ROUND', label: '轮询' },
            { value: 'RANDOM', label: '随机' },
            { value: 'CONSISTENT_HASH', label: '一致性HASH' },
            { value: 'LEAST_FREQUENTLY_USED', label: '最不经常使用' },
            { value: 'LEAST_RECENTLY_USED', label: '最近最久未使用' },
            { value: 'FAILOVER', label: '故障转移' },
            { value: 'BUSYOVER', label: '忙碌转移' },
            { value: 'SHARDING_BROADCAST', label: '分片广播' },
          ]}
        />
        <ProFormText
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          label="子任务ID"
        />
        <ProFormSelect
          name="misfireStrategy"
          label="调度过期策略"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          request={async () => [
            { value: 'DO_NOTHING', label: '忽略' },
            { value: 'FIRE_ONCE_NOW', label: '立即执行一次' },
          ]}
        />
        <ProFormSelect
          name="executorBlockStrategy"
          label="阻塞处理策略"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
          request={async () => [
            { value: 'SERIAL_EXECUTION', label: '单机串行' },
            { value: 'DISCARD_LATER', label: '丢弃后续调度' },
            { value: 'COVER_EARLY', label: '覆盖之前的调度' },
          ]}
        />
        <ProFormText
          name="executorTimeout"
          label="超时时间"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
        />
        <ProFormText
          name="executorFailRetryCount"
          label="失败重试次数"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colProps={{ xl: 12 }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default ModifyTask;
