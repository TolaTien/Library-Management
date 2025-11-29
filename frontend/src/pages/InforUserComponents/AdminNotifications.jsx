import React, { useEffect, useState } from 'react';
import './AdminNotifications.css';
import { List, Card, message, Spin, Empty } from 'antd';
import { requestGetReminder } from '../../config/request';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await requestGetReminder(); // gọi API
                // res = { success: true, data: [...] }
                if (res.success && Array.isArray(res.data)) {
                    setNotifications(res.data);
                } else {
                    setNotifications([]);
                }
            } catch (err) {
                message.error('Không thể tải thông báo');
                console.error(err);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="admin-notifications">
            <h2>Thông báo từ Admin</h2>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" tip="Đang tải thông báo..." />
                </div>
            ) : notifications.length === 0 ? (
                <Empty description="Không có thông báo" />
            ) : (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={notifications}
                    renderItem={item => (
                        <List.Item>
                            <Card title={item.title || 'Thông báo'}>
                                {item.message || ''}
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default AdminNotifications;
