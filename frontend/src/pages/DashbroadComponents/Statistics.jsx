import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Pie, Column } from "@ant-design/charts";
import { UserOutlined, BookOutlined, SolutionOutlined } from '@ant-design/icons';
import { requestStatistics } from '../../config/request';// Import file CSS riêng
import './Statistics.css'; 

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
        // BEM: stats-panel
        <div className="stats-panel">
            {/* BEM: stats-panel__header */}
            <h2 className="stats-panel__header">Thống kê tổng quan</h2>
            
            {/* BEM: stats-panel__kpi-row */}
            <Row gutter={16} className="stats-panel__kpi-row">
                <Col span={8}>
                    <Card className="stats-panel__kpi-card">
                        <Statistic title="Tổng số người dùng" value={data?.totalUsers || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="stats-panel__kpi-card">
                        <Statistic title="Tổng số đầu sách" value={data?.totalBooks || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="stats-panel__kpi-card">
                        <Statistic
                            title="Yêu cầu chờ duyệt"
                            value={data?.pendingRequests || 0}
                            prefix={<SolutionOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            
            {/* BEM: stats-panel__chart-row */}
            <Row gutter={24} className="stats-panel__chart-row">
                <Col span={12}>
                    <Card title="Tình trạng sách trong kho" className="stats-panel__chart-card">
                        <Pie {...pieConfig} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Tình trạng mượn sách" className="stats-panel__chart-card">
                        <Column {...columnConfig} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Statistics;