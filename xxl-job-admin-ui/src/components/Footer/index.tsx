import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';
import Settings from '../../../config/defaultSettings';
const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`2015-${currentYear} Powered by XXL-JOB ${Settings.version}`}
      links={[
        {
          key: 'xuxueli',
          title: 'xuxueli',
          href: 'https://www.xuxueli.com/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/xuxueli/xxl-job',
          blankTarget: true,
        },
        {
          key: 'XXL-JOB',
          title: 'XXL-JOB',
          href: 'https://github.com/xuxueli/xxl-job',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
