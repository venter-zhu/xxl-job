import { Area, Pie } from '@ant-design/charts';
import { PageContainer, StatisticCard } from '@ant-design/pro-components';
import { Card, Col, Row } from 'antd';

const Dashboard = () => {
  const data = [
    {
      date: '2022-01-01',
      value: 10,
      type: '成功',
    },
    {
      date: '2022-01-01',
      value: 10,
      type: '失败',
    },
    {
      date: '2022-01-01',
      value: 10,
      type: '进行中',
    },
    {
      date: '2022-01-02',
      value: 10,
      type: '成功',
    },
    {
      date: '2022-01-02',
      value: 10,
      type: '失败',
    },
    {
      date: '2022-01-02',
      value: 10,
      type: '进行中',
    },
    {
      date: '2022-01-03',
      value: 10,
      type: '成功',
    },
    {
      date: '2022-01-03',
      value: 10,
      type: '失败',
    },
    {
      date: '2022-01-03',
      value: 10,
      type: '进行中',
    },
    {
      date: '2022-01-04',
      value: 10,
      type: '成功',
    },
    {
      date: '2022-01-05',
      value: 10,
      type: '失败',
    },
    {
      date: '2022-01-04',
      value: 10,
      type: '进行中',
    },
  ];
  const config = {
    data,
    height: 400,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
  };

  const pieData = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];
  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    legend: false,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <PageContainer>
      <StatisticCard.Group direction="row">
        <StatisticCard
          statistic={{
            title: '总流量(人次)',
            value: 601986875,
          }}
        />
        <StatisticCard
          statistic={{
            title: '总流量(人次)',
            value: 601986875,
          }}
        />
        <StatisticCard
          statistic={{
            title: '总流量(人次)',
            value: 601986875,
          }}
        />
      </StatisticCard.Group>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="日期分布图">
            <Area {...config} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="成功比例图">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
