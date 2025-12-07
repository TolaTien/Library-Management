import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
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

    const loanStatusData = data?.booksData || [];

    return (
        <div className="statistics-container">
            <h2>Thống kê tổng quan</h2>

            {/* 3 CARD THỐNG KÊ */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-title">Tổng số người dùng</div>
                    <div className="stat-value">{data?.totalUsers || 0}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-title">Tổng số đầu sách</div>
                    <div className="stat-value">{data?.totalBooks || 0}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-title">Yêu cầu chờ duyệt</div>
                    <div className="stat-value">{data?.pendingRequests || 0}</div>
                </div>
            </div>

            {/* BIỂU ĐỒ */}
            <div className="chart-card">
                <h3>Tình trạng mượn sách</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={loanStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Statistics;
