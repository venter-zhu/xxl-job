import { ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { RadioChangeEvent } from 'antd';
import React, { useState } from 'react';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.XxlJobGroup) => void;
  onSubmit: (values: API.XxlJobGroup) => Promise<void>;
  open: boolean;
  values?: API.XxlJobGroup;
  title?: string;
};

const ModifyExecutor: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [addressAble, setAddressAble] = useState<boolean>(props?.values?.addressType == 0);

  return (
    <ModalForm<API.XxlJobGroup, API.XxlJobGroup>
      width={600}
      layout="horizontal"
      title={props.values?.appname ? '编辑' : '新增'}
      open={props.open}
      autoFocusFirstInput
      modalProps={{
        centered: true,
        destroyOnClose: true,
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      initialValues={{ ...props.values, addressType: props.values ? props.values.addressType : 1 }}
      submitter={{
        searchConfig: {
          submitText: '保存',
          resetText: '取消',
        },
      }}
      submitTimeout={2000}
      onFinish={props.onSubmit}
    >
      <ProFormText name="id" hidden />
      <ProFormText
        label="AppName"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        name="appname"
        rules={[{ required: true, message: '请输入AppName' }]}
      />
      <ProFormText
        name="title"
        label="名称"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        rules={[{ required: true, message: '请输入名称' }]}
      />
      <ProFormRadio.Group
        name="addressType"
        label="注册方式"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        options={[
          {
            label: '自动注册',
            value: 0,
          },
          {
            label: '手动注册',
            value: 1,
          },
        ]}
        fieldProps={{
          onChange: (e: RadioChangeEvent) => {
            setAddressAble(!e.target.value);
          },
        }}
      />
      <ProFormTextArea
        label="机器地址"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        name="addressList"
        fieldProps={{
          disabled: addressAble,
        }}
      />
    </ModalForm>
  );
};

export default ModifyExecutor;
