import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, SolutionOutlined, IdcardOutlined, BookOutlined, LineChartOutlined } from '@ant-design/icons';

import UserManagement from './UserManagement';
import LoanRequestManagement from './LoanRequestManagement';
import CardIssuanceManagement from './CardIssuanceManagement';
import BookManagement from './BookManagement';
import Statistics from './Statistics';
import './IndexDashBroad.css';


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
        <Layout className="dashboard-layout">
        <Sider breakpoint="lg" collapsedWidth="0">
            <div className="logo">Library</div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['stats']}
                onClick={(e) => setSelectedKey(e.key)}
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

        <Layout>
            <Header />
            <Content className="dashboard-content">
                <div className="dashboard-inner">
                    {renderContent()}
                </div>
            </Content>
            <Footer>Thư viện đẳng cấp nhất thế giới</Footer>
        </Layout>
    </Layout>
);
};

export default IndexDashBroad;
