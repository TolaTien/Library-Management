import React, { useEffect, useState } from 'react';
import './AdminNotifications.css';
import { requestGetReminder } from '../../config/request';
import { toast } from 'react-toastify'; // Thay message bằng toast

import CustomCard from '../../cardbody/CustomCard';


const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await requestGetReminder(); 
                if (res.success && Array.isArray(res.data)) {
                    setNotifications(res.data);
                } else {
                    setNotifications([]);
                }
            } catch (err) {
                toast.error('Không thể tải thông báo');
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
            <h2>📢 Thông báo từ Admin</h2>

            {loading ? (
                <div className="notif-loading">
                    <div className="notif-spinner"></div>
                    <span>Đang tải thông báo...</span>
                </div>
            ) : notifications.length === 0 ? (
                // Thay thế Empty
                <div className="notif-empty">
                    <div className="notif-empty-icon">📭</div> {/* Dùng Emoji hộp thư rỗng */}
                    <span>Không có thông báo nào</span>
                </div>
            ) : (
                // Thay thế List
                <div className="notif-list">
                    {notifications.map((item, index) => (
                      
                        // Key nên dùng ID nếu có, tạm dùng index nếu API không trả ID
                        <CustomCard 
                            key={item.id || index} 
                            title={item.title || 'Thông báo hệ thống'}
                            className="notif-card"
                        >
                            <div className="notif-card-content">
                                {item.message || 'Không có nội dung chi tiết.'}
                            </div>
                        </CustomCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;