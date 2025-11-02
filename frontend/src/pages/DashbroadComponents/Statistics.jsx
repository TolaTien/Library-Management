import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import { UserOutlined, BookOutlined, SolutionOutlined } from '@ant-design/icons';
import { requestStatistics } from '../../config/request';

const Statistics = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestStatistics();
            setData(res);
        };
        fetchData();
    }, []);

    // Fake data for charts
    const bookStatusData = data?.bookStatusData;

    const loanStatusData = data?.loanStatusData;

    const pieConfig = {
        appendPadding: 10,
        data: bookStatusData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [{ type: 'element-active' }],
    };

    const columnConfig = {
        data: loanStatusData,
        xField: 'status',
        yField: 'count',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Thống kê tổng quan</h2>
            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic title="Tổng số người dùng" value={data?.totalUsers || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Tổng số đầu sách" value={data?.totalBooks || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Yêu cầu chờ duyệt"
                            value={data?.pendingRequests || 0}
                            prefix={<SolutionOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Card title="Tình trạng mượn sách">
                        <Column {...columnConfig} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Statistics;
