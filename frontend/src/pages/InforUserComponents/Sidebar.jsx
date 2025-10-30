import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';

const Sidebar = ({ setActiveComponent, activeComponent }) => {
    const handleLogout = () => {
        console.log('User logged out');
        // Thêm logic đăng xuất ở đây, ví dụ: xóa token, redirect về trang đăng nhập
    };

    const items = [
        {
            key: 'info',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
            onClick: () => setActiveComponent('info'),
        },
        {
            key: 'history',
            icon: <HistoryOutlined />,
            label: 'Lịch sử mượn sách',
            onClick: () => setActiveComponent('history'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
            danger: true, // Hiển thị màu đỏ để cảnh báo
        },
    ];

    return (
        <Menu
            className="h-full"
            selectedKeys={[activeComponent]}
            mode="inline"
            items={items}
        />
    );
};

export default Sidebar;

