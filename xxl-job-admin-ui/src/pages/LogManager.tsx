import { queryGroupList } from '@/services/xxl-job/JobGroupController';
import { pageLogList } from '@/services/xxl-job/jobLogController';
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Descriptions, DescriptionsProps, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useRef, useState } from 'react';

const LogManager: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.XxlJobLog>();
  const [triggerMsgOpen, setTriggerMsgOpen] = useState<boolean>(false);
  const [runTaskFrom] = useForm<API.triggerTaskParams>();
  const [registerInfo, setRegisterInfo] = useState<boolean>(false);
  const [currentRowRegister, setCurrentRowRegister] = useState<string[]>([]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const columns: ProColumns<API.XxlJobLog>[] = [
    {
      title: '任务ID',
      dataIndex: 'jobId',
      hideInSearch: true,
      render: (text, record, _, action) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            setRegisterInfo(true);
          }}
        >
          {text}
        </a>,
      ],
    },
    {
      title: '调度时间',
      hideInSearch: true,
      valueType: 'dateTime',
      dataIndex: 'triggerTime',
    },
    {
      title: '执行器',
      key: 'jobGroup',
      valueType: 'select',
      hideInTable: true,
      fieldProps: (form, config) => {
        return {
          showSearch: true,
        };
      },
      request: async () => {
        let data: API.XxlJobGroup[] | undefined = (await queryGroupList()).content;
        let options = [];
        if (data) {
          for (let item of data) {
            if (item.appname) {
              options.push({ label: item.title, value: item.id });
            }
          }
        }
        return options;
      },
    },
    {
      title: '状态',
      hideInTable: true,
      valueType: 'select',
      key: 'logStatus',
      valueEnum: {
        '-1': {
          text: '全部',
        },
        1: {
          text: '成功',
        },
        2: {
          text: '失败',
        },
        3: {
          text: '进行中',
        },
      },
    },
    {
      title: '调度时间',
      hideInTable: true,
      valueType: 'dateRange',
      key: 'filterTime',
      search: {
        transform: (value) => {
          if (value && value instanceof Array) {
            return value[0] + ' 00:00:00' + ' - ' + value[1] + ' 23:59:59';
          } else {
            return '';
          }
        },
      },
    },
    {
      title: '调度结果',
      hideInSearch: true,
      dataIndex: 'triggerCode',
      render: (text, record, _, action) => [
        text === 200 ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <ExclamationCircleTwoTone twoToneColor="#f5222d" />
        ),
      ],
    },
    {
      title: '调度备注',
      hideInSearch: true,
      dataIndex: 'triggerMsg',
      render: (text, record, _, action) => [
        <a
          onClick={() => {
            setTriggerMsgOpen(true);
            setCurrentRow(record);
          }}
        >
          查看
        </a>,
      ],
    },
    {
      title: '执行时间',
      hideInSearch: true,
      dataIndex: 'handleTime',
      valueType: 'dateTime',
    },
    {
      title: '执行结果',
      hideInSearch: true,
      dataIndex: 'handleCode',
      render: (text, record_, action) => [
        text === 200 ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : text === 0 ? (
          '-'
        ) : (
          <ExclamationCircleTwoTone twoToneColor="#f5222d" />
        ),
      ],
    },
    {
      title: '执行备注',
      hideInSearch: true,
      dataIndex: 'handleMsg',
      render: (text, record, _, action) => [text == null || text == '' ? <a>查看</a> : '无'],
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="run"
          onClick={() => {
            setCurrentRow(record);
            // setRunTaskOpen(true);
          }}
        >
          执行日志
        </a>,
      ],
    },
  ];

  const executorInfo: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '执行器地址',
      children: currentRow?.executorAddress,
    },
    {
      key: '2',
      label: 'JobHandler',
      children: currentRow?.executorHandler,
    },
    {
      key: '3',
      label: '任务参数',
      children: currentRow?.executorParam,
    },
  ];
  return (
    <PageContainer title={false}>
      <ProTable<API.XxlJobLog, API.LogPageRequest>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            danger
            key="primary"
            onClick={() => {
              setTaskModalOpen(true);
            }}
          >
            清理
          </Button>,
        ]}
        request={pageLogList}
        columns={columns}
      />
      {/* 执行地址等信息 */}
      <Modal
        centered
        open={registerInfo}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setRegisterInfo(false);
              setCurrentRow(undefined);
            }}
          >
            确认
          </Button>,
        ]}
        onCancel={() => {
          setRegisterInfo(false);
          setCurrentRow(undefined);
        }}
      >
        <Descriptions title="调度信息" column={1} items={executorInfo} />
      </Modal>
      {/* 调度备注 */}
      <Modal
        centered
        open={triggerMsgOpen}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setTriggerMsgOpen(false);
              setCurrentRow(undefined);
            }}
          >
            确认
          </Button>,
        ]}
        onCancel={() => {
          setTriggerMsgOpen(false);
          setCurrentRow(undefined);
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: currentRow?.triggerMsg ? currentRow?.triggerMsg : '' }}
        ></div>
      </Modal>
    </PageContainer>
  );
};

export default LogManager;
