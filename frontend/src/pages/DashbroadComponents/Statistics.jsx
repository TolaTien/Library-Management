import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Column } from '@ant-design/charts';
import { UserOutlined, BookOutlined, SolutionOutlined } from '@ant-design/icons';
import { requestStatistics } from '../../config/request';
import './Statistics.css';

const Statistics = () => {
    const [data, setData] = useState({
        totalUsers: 0,
        totalBooks: 0,
        pendingRequests: 0,
        bookStatus: [],
        booksData: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await requestStatistics();
                if (res?.data) setData(res.data);
            } catch (error) {
                console.error("Fetch statistics failed:", error);
            }
        };
        fetchData();
    }, []);

    // Tối ưu: dùng useMemo để tránh re-render không cần thiết
    const columnConfig = useMemo(
        () => ({
            data: data.booksData,
            xField: 'status',
            yField: 'count',
            label: {
                position: 'middle',
                style: { fill: '#FFFFFF', opacity: 0.6 },
            },
            xAxis: { label: { autoHide: true, autoRotate: false } },
        }),
        [data.booksData]
    );

    const stats = [
        { title: "Tổng số người dùng", value: data.totalUsers, icon: <UserOutlined /> },
        { title: "Tổng số đầu sách", value: data.totalBooks, icon: <BookOutlined /> },
        { title: "Yêu cầu chờ duyệt", value: data.pendingRequests, icon: <SolutionOutlined /> },
    ];

    return (
        <div className="statistics-container">
            <h2 className="text-2xl mb-4">Thống kê tổng quan</h2>

            {/* Gom lại cho gọn, tránh lặp code */}
            <Row gutter={16} className="mb-6">
                {stats.map((item, index) => (
                    <Col span={8} key={index}>
                        <Card>
                            <Statistic title={item.title} value={item.value} prefix={item.icon} />
                        </Card>
                    </Col>
                ))}
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
