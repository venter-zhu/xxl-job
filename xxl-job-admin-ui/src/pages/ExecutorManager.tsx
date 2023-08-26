import {
  addGroup,
  queryGroupPage,
  removeGroup,
  updateGroup,
} from '@/services/xxl-job/JobGroupController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Modal, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';
import ModifyExecutor from './components/ModifyExecutor';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.XxlJobGroup) => {
  try {
    const result = await updateGroup({ ...fields });
    if (result.code !== 200) {
      return false;
    }
    message.success('更新成功');
    return true;
  } catch (error) {
    message.error('更新失败');
    return false;
  }
};

const handleAdd = async (fields: API.XxlJobGroup) => {
  try {
    const result = await addGroup({ ...fields });
    if (result.code === 200) {
      message.success('新增成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const handleDel = async (id: number) => {
  try {
    const result = await removeGroup({ id: id });
    if (result.code === 200) {
      message.success('删除成功');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const ExecutorManager: React.FC = () => {
  const [registerInfo, setRegisterInfo] = useState<boolean>(false);
  const [executorInfo, setExecutorInfo] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.XxlJobGroup>();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const columns: ProColumns<API.XxlJobGroup>[] = [
    {
      title: '任务ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'AppName',
      colSize: 2,
      dataIndex: 'appname',
    },
    {
      title: '名称',
      colSize: 2,
      dataIndex: 'title',
    },
    {
      title: '注册方式',
      dataIndex: 'addressType',
      hideInSearch: true,
      valueEnum: {
        0: '自动注册',
        1: '手动注册',
      },
    },
    {
      title: 'Online 机器地址',
      valueType: 'option',
      render: (_, record) => {
        if (record.registryList) {
          return [
            <a
              key={Math.random()}
              onClick={() => {
                setRegisterInfo(true);
                setCurrentRow(record);
              }}
            >
              查看({record.registryList?.length})
            </a>,
          ];
        }
        return ['无'];
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setExecutorInfo(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            if (record.id) {
              const success = await handleDel(record.id);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer title={false}>
      <ProTable<API.XxlJobGroup, API.ExecutorPageRequest>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
          span: 4,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setExecutorInfo(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={queryGroupPage}
        columns={columns}
      />
      <ModifyExecutor
        key={Math.random()}
        onSubmit={async (value) => {
          let success = false;
          if (value.id) {
            success = await handleUpdate(value);
          } else {
            success = await handleAdd(value);
          }
          if (success) {
            setCurrentRow(undefined);
            setExecutorInfo(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setCurrentRow(undefined);
          setExecutorInfo(false);
        }}
        open={executorInfo}
        values={currentRow}
      />
      <Modal
        maskClosable={false}
        width={450}
        centered
        title="注册节点"
        key={currentRow?.id}
        open={registerInfo}
        footer={[
          <Button key="close" type="primary" onClick={() => setRegisterInfo(false)}>
            确认
          </Button>,
        ]}
        onCancel={() => setRegisterInfo(false)}
      >
        <ol>
          {currentRow?.registryList?.map((item, index) => {
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

export default ExecutorManager;
