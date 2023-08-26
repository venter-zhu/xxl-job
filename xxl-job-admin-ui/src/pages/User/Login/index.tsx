import { Footer } from '@/components';
import feishu from '@/pages/components/icon/feishu';
import wecom from '@/pages/components/icon/wecom';
import { login } from '@/services/xxl-job/IndexController';
import {
  AlipayCircleOutlined,
  DingdingOutlined,
  DingtalkCircleFilled,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, SelectLang, history, useIntl, useModel } from '@umijs/max';
import { Alert, Col, Divider, Space, message } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const ActionIcons = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName} />
      <DingtalkCircleFilled key="DingtalkCircleFilled" className={langClassName} />
    </>
  );
};

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};
const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.ReturnTString>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const dingtalkLoginUrl = `https://login.dingtalk.com/oauth2/auth?client_id=${
    Settings.loginProps?.clientId
  }&redirect_uri=${
    Settings.loginProps?.callbackUrl
  }&response_type=code&state=${crypto.randomUUID()}&scope=openid&prompt=consent`;
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
    return userInfo;
  };

  const handleSubmit = async (values: API.PasswordLoginRequest) => {
    try {
      // 登录
      const msg = await login({ ...values });
      if (msg.code === 200) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  // 等待第三方登录
  useEffect(() => {
    if (loginLoading) {
      let waitSecond = 0;
      let dalaySecond = 1000;
      const timmer = setInterval(async () => {
        let val = await fetchUserInfo();
        if (val) {
          setLoginLoading(false);
          clearTimeout(timmer);
          message.success('登录成功');
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
        } else {
          waitSecond = waitSecond + dalaySecond;
        }
        if (waitSecond > 20000) {
          message.error('登录超时');
          clearTimeout(timmer);
          setLoginLoading(false);
        }
      }, dalaySecond);
    }
  }, [loginLoading]);
  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          flex: '1',
        }}
      >
        <Col span={8} offset={8}>
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            // logo={<img alt="logo" src="/xxl-logo.jpg" />}
            title="XXLJOB"
            subTitle="开源分布式任务调度平台"
            initialValues={{
              ifRemember: true,
            }}
            loading={loginLoading}
            onFinish={async (values) => {
              await handleSubmit(values as API.PasswordLoginRequest);
            }}
            actions={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Divider plain>
                  <span style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}>
                    其他登录方式
                  </span>
                </Divider>
                <Space align="center" size={24}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid #D4D8DD',
                      borderRadius: '50%',
                    }}
                  >
                    <DingdingOutlined
                      style={{ ...iconStyles, color: '#1677FF' }}
                      onClick={() => {
                        setLoginLoading(true);
                        const w = window.open('about:blank');
                        w.location.href = dingtalkLoginUrl;
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid #D4D8DD',
                      borderRadius: '50%',
                    }}
                  >
                    <Icon
                      component={feishu}
                      style={{ fontSize: '18px' }}
                      onClick={() => {
                        setLoginLoading(true);
                        const w = window.open('about:blank');
                        w.location.href = dingtalkLoginUrl;
                      }}
                    />

                    {/* <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} /> */}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid #D4D8DD',
                      borderRadius: '50%',
                    }}
                  >
                    <Icon component={wecom} style={{ fontSize: '18px' }} />
                    {/* <WeiboOutlined style={{ ...iconStyles, color: '#333333' }} /> */}
                  </div>
                </Space>
              </div>
            }
          >
            {userLoginState && userLoginState.code == 500 && (
              <LoginMessage content="账号或密码错误" />
            )}
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="ifRemember">
                记住我
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </LoginForm>
        </Col>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
