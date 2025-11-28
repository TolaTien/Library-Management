import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import { UserOutlined, BookOutlined, SolutionOutlined } from '@ant-design/icons';
import { requestStatistics } from '../../config/request';
import './Statistics.css';


const Statistics = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestStatistics();
            setData(res.data);
        };
        fetchData();
    }, []);

    // Fake data for charts


    const loanStatusData = data?.booksData;


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
        <div className="statistics-container">
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
