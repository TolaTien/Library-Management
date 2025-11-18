import { Menu } from 'antd';
import './Sidebar.css';
import { UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
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

