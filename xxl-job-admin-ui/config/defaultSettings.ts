import { ProLayoutProps } from '@ant-design/pro-components';

type DingTalkLoginProps = {
  callbackUrl?: string;
  grantType?: string;
  clientId?: string;
  clientSecret?: string;
  verificationToken?: string;
  encryptKey?: string;
};

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
  version?: string;
  loginProps?: DingTalkLoginProps;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'XXLJOB',
  pwa: true,
  logo: '/xxl-job-admin/xxl-logo.jpg',
  version: '2.5.0',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
  loginProps: {
    callbackUrl: 'http://localhost:8080/xxl-job-admin/auth/dingtalk/callback',
    clientId: 'dinga2lkxl7fb9sueti7',
    clientSecret: 'ITGFwMoN4UYfLv6jR5gJBmH7RH3LBa3enbzJ_G_4LuPp_GGsOXSz1i0rskPDUco7',
  },
};

export default Settings;
