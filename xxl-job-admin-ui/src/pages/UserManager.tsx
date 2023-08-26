import { queryGroupList } from '@/services/xxl-job/JobGroupController';
import { queryUserPage, removeUser } from '@/services/xxl-job/userController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Tooltip, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useRef, useState } from 'react';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.XxlJobInfo) => {
  const hide = message.loading('Configuring');
  try {
    // await updateTask({
    //   jobInfo: fields,
    // });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleDelete = async (id?: number) => {
  if (!id) {
    return false;
  }
  try {
    let result = await removeUser({ id: id });
    if (result.code == 200) {
      message.success('删除成功');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
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

const UserManager: React.FC = () => {
  const [updateAddUserOpen, setUpdateAddUserOpen] = useState<boolean>(false);
  const [updateAddUserForm] = useForm<API.XxlJobUser>();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.XxlJobUser>();
  // 当modal框关闭的时候，重置输入框
  useEffect(() => {
    updateAddUserForm?.resetFields();
  }, [updateAddUserOpen]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const columns: ProColumns<API.XxlJobUser>[] = [
    {
      title: '任务ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '账号',
      dataIndex: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueEnum: {
        0: {
          text: '游客',
        },
        1: {
          text: '管理员',
        },
        2: {
          text: '开发',
        },
        3: {
          text: '测试',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setUpdateAddUserOpen(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            let result = await handleDelete(record.id);
            if (result) {
              action?.reload();
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
      <ProTable<API.XxlJobUser, API.UserPageRequest>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setUpdateAddUserOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={queryUserPage}
        columns={columns}
      />
      <ModalForm
        key={Math.random()}
        width={600}
        form={updateAddUserForm}
        title={currentRow?.id ? '编辑用户' : '新增用户'}
        layout="horizontal"
        open={updateAddUserOpen}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          centered: true,
          onCancel: () => {
            setUpdateAddUserOpen(false);
            setCurrentRow(undefined);
          },
        }}
        submitter={{
          searchConfig: {
            submitText: '保存',
            resetText: '取消',
          },
        }}
        initialValues={{
          ...currentRow,
          permission: currentRow?.permission ? currentRow.permission.split(',') : undefined,
        }}
        submitTimeout={2000}
        onFinish={async (value) => {
          console.log(value);
          setUpdateAddUserOpen(false);
          setCurrentRow(undefined);
        }}
      >
        <ProFormText hidden name="id" />
        <ProFormText
          labelCol={{ span: 4 }}
          name="username"
          label="账号"
          placeholder="请输入账号"
          disabled={currentRow?.id ? true : false}
        />
        <ProFormText labelCol={{ span: 4 }} name="password" label="密码" placeholder="请输入密码" />
        <ProFormRadio.Group
          name="role"
          label="角色"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[{ required: true }]}
          options={[
            {
              label: <Tooltip title="只有浏览权限">游客</Tooltip>,
              value: 0,
            },
            {
              label: <Tooltip title="拥有全部权限">管理员</Tooltip>,
              value: 1,
            },
            {
              label: <Tooltip title="拥有所属执行器任务的全部权限">开发</Tooltip>,
              value: 2,
            },
            {
              label: <Tooltip title="只有手动执行权限">测试</Tooltip>,
              value: 3,
            },
          ]}
        />
        <ProFormSelect
          name="permission"
          mode="multiple"
          label="权限"
          labelCol={{ span: 4 }}
          request={groupSelect}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserManager;
