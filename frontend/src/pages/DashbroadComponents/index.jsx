import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, SolutionOutlined, IdcardOutlined, BookOutlined, LineChartOutlined } from '@ant-design/icons';

import UserManagement from './UserManagement';
import LoanRequestManagement from './LoanRequestManagement';
import CardIssuanceManagement from './CardIssuanceManagement';
import BookManagement from './BookManagement';
import Statistics from './Statistics';

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
        <Layout style={{ minHeight: '100vh' }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div className="h-8 m-4 bg-gray-700 text-white text-center leading-8">Logo</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['stats']} onClick={(e) => setSelectedKey(e.key)}>
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
            <Layout>
                <Header className="bg-white p-0" />
                <Content style={{ margin: '24px 16px 0' }}>
                    <div className="p-6 bg-white" style={{ minHeight: 360 }}>
                        {renderContent()}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Library Management ©2024 Created by Cascade</Footer>
            </Layout>
        </Layout>
    );
};

export default IndexDashBroad;
