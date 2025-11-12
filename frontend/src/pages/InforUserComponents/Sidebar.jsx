import React from 'react';
import { Menu } from 'antd';
import './Sidebar.css';
import { UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
<<<<<<< HEAD
import { requestLogout } from "../../config/request";
import { useNavigate } from 'react-router-dom';



const Sidebar = ({ setActiveComponent, activeComponent }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await requestLogout();
            navigate('/');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Failed to logout:', error);
        }
=======
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
        // Thêm logic đăng xuất ở đây, ví dụ: xóa token, redirect về trang đăng nhập
>>>>>>> 8e333a1de0fa3738b06091de65e0b379cdb131c5
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
            className="dashbroad-sidebar"
            selectedKeys={[activeComponent]}
            mode="inline"
            items={items}
        />
    );
};

export default Sidebar;

