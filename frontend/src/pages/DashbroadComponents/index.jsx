import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, SolutionOutlined, IdcardOutlined, BookOutlined, LineChartOutlined } from '@ant-design/icons';

import UserManagement from './UserManagement';
import LoanRequestManagement from './LoanRequestManagment';
import CardIssuanceManagement from './CardIssuanceManagement';
import BookManagement from './BookManagement';
import Statistics from './Statistics';
// Import file CSS riêng
import './Index.css';

const { Header, Content, Sider, Footer } = Layout;

const components = {
    stats: <Statistics />,
    user: <UserManagement />,
    loan: <LoanRequestManagement />,
    card: <CardIssuanceManagement />,
    book: <BookManagement />,
};

const IndexDashBroad = () => {
    const [selectedKey, setSelectedKey] = useState('stats');

    const renderContent = () => {
        return components[selectedKey] || <div>Chọn một mục từ menu</div>;
    };

    return (
        // BEM: admin-dashboard-layout
        <Layout className="admin-dashboard-layout">
            <Sider breakpoint="lg" collapsedWidth="0">
                {/* BEM: admin-dashboard__logo */}
                <div className="admin-dashboard__logo">Library Admin</div> 
                
                <Menu 
                    theme="dark" 
                    mode="inline" 
                    defaultSelectedKeys={['stats']} 
                    onClick={(e) => setSelectedKey(e.key)}
                    className="admin-dashboard__menu"
                >
                    <Menu.Item key="stats" icon={<LineChartOutlined />}>
                        Thống kê
                    </Menu.Item>
                    <Menu.Item key="book" icon={<BookOutlined />}>
                        Quản lý sách
                    </Menu.Item>
                    <Menu.Item key="loan" icon={<SolutionOutlined />}>
                        Quản lý mượn sách
                    </Menu.Item>
                    <Menu.Item key="card" icon={<IdcardOutlined />}>
                        Quản lý cấp thẻ
                    </Menu.Item>
                    <Menu.Item key="user" icon={<UserOutlined />}>
                        Quản lý người dùng
                    </Menu.Item>
                </Menu>
            </Sider>
            
            {/* BEM: admin-dashboard__main-layout */}
            <Layout className="admin-dashboard__main-layout">
                {/* BEM: admin-dashboard__header */}
                <Header className="admin-dashboard__header" />
                
                {/* BEM: admin-dashboard__content-wrapper */}
                <Content className="admin-dashboard__content-wrapper">
                    {/* BEM: admin-dashboard__content-panel */}
                    <div className="admin-dashboard__content-panel">
                        {renderContent()}
                    </div>
                </Content>
                
                {/* BEM: admin-dashboard__footer */}
                <Footer className="admin-dashboard__footer">
                    Library Management ©2024 Created by Cascade
                </Footer>
            </Layout>
        </Layout>
    );
};

export default IndexDashBroad;