import 'antd/dist/reset.css';
import Cron, { CronProps } from 'qnn-react-cron';
import React from 'react';

const DefaultCron: React.FC<CronProps> = Cron as React.FC<CronProps>;

export type CronVal = {
  val?: string;
  setVal: (val?: string) => void;
};

const CronGenerator: React.FC<CronVal> = (props) => {
  const panesShow = {
    second: true,
    minute: true,
    hour: true,
    day: true,
    month: true,
    week: true,
    year: true,
  };
  return (
    <DefaultCron
      style={{ width: 430 }}
      value={props.val}
      onOk={(value: string) => props.setVal(value)}
      getCronFns={(fns) => {
        // 获取值方法
        props.setVal(fns.getValue());
        // 解析Cron表达式到UI 调用该方法才可以重新渲染 【一般不使用】(value值改变后组件会自动更新渲染)
        // fns.onParse: () => Promise().then(()=>void).catch(()=>()=>void),
        // this.fns = fns;
      }}
      footer={false}
      panesShow={panesShow}
      defaultTab="second"
    />
  );
};

export default CronGenerator;
