import React from 'react';
import './Sidebar.css';
import { UserOutlined, HistoryOutlined, LogoutOutlined,NotificationOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { requestLogout } from '../../config/request'; 

const Sidebar = ({ setActiveComponent, activeComponent }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log('User logged out');
        try {
            await requestLogout();
            navigate('/');
            setTimeout(() => window.location.reload(), 1000);
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Định nghĩa danh sách menu (Dữ liệu thuần, không chứa component Antd)
    const menuItems = [
        {
            key: 'info',
            icon: '👤', // Có thể thay bằng <FaUser /> nếu dùng react-icons
            label: 'Thông tin cá nhân',
            onClick: () => setActiveComponent('info'),
        },
        {
            key: 'history',
            icon: '📖', // Có thể thay bằng <FaHistory />
            label: 'Lịch sử mượn sách',
            onClick: () => setActiveComponent('history'),
        },
        {
            key: 'notifications',
            icon: <NotificationOutlined />,
            label: 'Thông báo',
            onClick: () => setActiveComponent('notifications'),
        },
        {
            key: 'logout',
            icon: '🚪', // Có thể thay bằng <FaSignOutAlt />
            label: 'Đăng xuất',
            onClick: handleLogout,
            isDanger: true, // Đánh dấu là nút nguy hiểm
        },
    ];

    return (
        <div className="custom-sidebar">
            <ul className="sidebar-menu">
                {menuItems.map((item) => {
                    // Kiểm tra xem item này có đang được chọn không
                    const isActive = activeComponent === item.key;
                    
                    // Tạo class động
                    let className = 'menu-item';
                    if (isActive) className += ' active';
                    if (item.isDanger) className += ' danger';

                    return (
                        <li 
                            key={item.key} 
                            className={className}
                            onClick={item.onClick}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-label">{item.label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;