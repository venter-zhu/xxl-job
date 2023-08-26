import { loadGroupById, queryGroupList } from '@/services/xxl-job/JobGroupController';
import {
  addTask,
  queryTaskPage,
  removeTask,
  startTask,
  stopTask,
  updateTask,
} from '@/services/xxl-job/taskController';
import { queryUserList } from '@/services/xxl-job/userController';
import { DownOutlined, PlusOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Divider, Dropdown, Modal, Space, Tag, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ModifyTask from './components/ModifyTask';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleTaskUpdate = async (fields: API.XxlJobInfo) => {
  try {
    const result = await updateTask({ ...fields });
    if (result.code === 200) {
      message.success('更新成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const handleTaskAdd = async (fields: API.XxlJobInfo) => {
  try {
    const result = await addTask({ ...fields });
    if (result.code === 200) {
      message.success('新增成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const handleTaskStop = async (id?: number) => {
  if (!id) {
    return false;
  }
  try {
    const result = await stopTask({ id: id });
    if (result.code === 200) {
      message.success('停止成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const handleTaskStart = async (id?: number) => {
  if (!id) {
    return false;
  }
  try {
    const result = await startTask({ id: id });
    if (result.code === 200) {
      message.success('运行成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const handleTaskDelete = async (id?: number) => {
  if (!id) {
    return false;
  }
  try {
    const result = await removeTask({ id: id });
    if (result.code === 200) {
      message.success('删除成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const getTaskAddress = async (groupId?: number) => {
  if (!groupId) {
    return [];
  }
  try {
    const result = await loadGroupById({ id: groupId });
    console.log(result);
    if (result.code === 200) {
      return result.content?.registryList;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

const TaskManger: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.XxlJobInfo>();
  const [runTaskOpen, setRunTaskOpen] = useState<boolean>(false);
  const runTaskFrom = useRef<ProFormInstance>();
  const [registerInfo, setRegisterInfo] = useState<boolean>(false);
  const [currentRowRegister, setCurrentRowRegister] = useState<string[]>([]);

  useEffect(() => {
    runTaskFrom?.current?.resetFields();
  }, [runTaskOpen]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const columns: ProColumns<API.XxlJobInfo>[] = [
    {
      title: '任务ID',
      dataIndex: 'id',
      hideInSearch: true,
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
      title: '任务描述',
      dataIndex: 'jobDesc',
    },
    {
      title: '调度类型',
      key: 'scheduleType',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [record.scheduleType + ': ' + record.scheduleConf],
    },
    {
      title: '负责人',
      dataIndex: 'author',
      valueType: 'select',
      fieldProps: (form, config) => {
        return {
          showSearch: true,
        };
      },
      request: async () => {
        let data: API.XxlJobUser[] | undefined = (await queryUserList()).content;
        let options = [];
        if (data) {
          for (let item of data) {
            if (item.username) {
              options.push({ label: item.username, value: item.username });
            }
          }
        }
        return options;
      },
    },
    {
      title: '运行模式',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [record.glueType + ': ' + record.executorHandler],
    },
    {
      title: '调度状态',
      dataIndex: 'triggerStatus',
      hideInForm: false,
      valueEnum: {
        0: {
          text: <Tag icon={<StopOutlined />}>Stop</Tag>,
        },
        1: {
          text: (
            <Tag color="#73d13d" icon={<SyncOutlined spin />}>
              Running
            </Tag>
          ),
        },
      },
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
            setRunTaskOpen(true);
          }}
        >
          执行一次
        </a>,
        <Divider key="Divider2" type="vertical" />,
        <Dropdown
          key="actionGroup"
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'queryLog',
                label: '查询日志',
              },
              {
                key: 'registerAddr',
                label: (
                  <a
                    onClick={async () => {
                      let success;
                      if (record.jobGroup) {
                        success = await getTaskAddress(record.jobGroup);
                        if (success) {
                          setCurrentRowRegister(success);
                        }
                      }
                      setRegisterInfo(true);
                    }}
                  >
                    注册节点
                  </a>
                ),
              },
              {
                type: 'divider',
              },
              {
                key: 'toRun',
                label: (
                  <a
                    onClick={async () => {
                      let success;
                      if (record.triggerStatus) {
                        success = await handleTaskStop(record.id);
                      } else {
                        success = await handleTaskStart(record.id);
                      }
                      if (success) {
                        action?.reload();
                      }
                    }}
                  >
                    {record.triggerStatus == 1 ? '停止' : '启动'}
                  </a>
                ),
              },
              {
                key: 'edit',
                label: (
                  <a
                    onClick={() => {
                      setTaskModalOpen(true);
                      setCurrentRow(record);
                    }}
                  >
                    编辑
                  </a>
                ),
              },
              {
                key: 'delete',
                label: (
                  <a
                    onClick={async () => {
                      let success = await handleTaskDelete(record.id);
                      if (success) {
                        action?.reload();
                      }
                    }}
                  >
                    删除
                  </a>
                ),
              },
              {
                key: 'copy',
                label: '复制',
              },
            ],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              更多
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>,
      ],
    },
  ];
  return (
    <PageContainer title={false}>
      <ProTable<API.XxlJobInfo, API.TaskPageRequest>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 70,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setTaskModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={queryTaskPage}
        columns={columns}
      />
      {/* 编辑&新增任务model框 */}
      <ModifyTask
        key={currentRow?.id}
        onSubmit={async (value) => {
          let success;
          if (value.id) {
            success = await handleTaskUpdate(value);
          } else {
            success = await handleTaskAdd(value);
          }
          if (success) {
            setCurrentRow(undefined);
            setTaskModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setCurrentRow(undefined);
          setTaskModalOpen(false);
        }}
        open={taskModalOpen}
        values={currentRow}
      />
      {/* 手动执行任务 */}
      <ModalForm
        key={Math.random()}
        width={600}
        formRef={runTaskFrom}
        title="执行任务"
        layout="horizontal"
        open={runTaskOpen}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          centered: true,
          onCancel: () => {
            setCurrentRow(undefined);
            setRunTaskOpen(false);
          },
        }}
        submitter={{
          searchConfig: {
            submitText: '运行',
            resetText: '取消',
          },
        }}
        initialValues={{
          id: currentRow?.id,
          executorParam: currentRow?.executorParam,
        }}
        submitTimeout={2000}
        onFinish={async (value) => {
          let success;
          if (value.id) {
            success = await handleTaskUpdate(value);
          } else {
            success = await handleTaskAdd(value);
          }
          if (success) {
            setCurrentRow(undefined);
            setTaskModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText hidden name="id" />
        <ProFormTextArea
          labelCol={{ span: 4 }}
          name="executorParam"
          label={intl.formatMessage({
            id: 'task.jobParam',
            defaultMessage: '任务参数',
          })}
          placeholder={intl.formatMessage({
            id: 'task.jobParam.placeholder',
            defaultMessage: '请输入任务参数',
          })}
        />
        <ProFormSelect
          labelCol={{ span: 4 }}
          name="jobGroup"
          label="机器地址"
          request={async () => {
            let result = await getTaskAddress(currentRow?.jobGroup);
            let options = [];
            if (result) {
              for (let uri of result) {
                options.push({ label: uri, value: uri });
              }
            }
            return options;
          }}
          onChange={(value) => {
            runTaskFrom?.current?.setFieldValue('addressList', value);
          }}
        />
        <ProFormTextArea
          labelCol={{ span: 4 }}
          name="addressList"
          label="机器地址"
          placeholder="请输入本次执行的机器地址，为空则从执行器获取"
        />
      </ModalForm>
      {/* 注册节点信息 */}
      <Modal
        maskClosable={false}
        width={450}
        centered
        title="注册节点"
        key={Math.random()}
        open={registerInfo}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setRegisterInfo(false);
              setCurrentRowRegister([]);
            }}
          >
            确认
          </Button>,
        ]}
        onCancel={() => {
          setRegisterInfo(false);
          setCurrentRowRegister([]);
        }}
      >
        <ol>
          {currentRowRegister?.map((item, index) => {
            return (
              <li key={index}>
                <Tag color="#389e0d">{item}</Tag>
              </li>
            );
          })}
        </ol>
      </Modal>
    </PageContainer>
  );
};

export default TaskManger;
