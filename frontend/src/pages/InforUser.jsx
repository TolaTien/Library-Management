import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import Sidebar from "./InforUserComponents/Sidebar.jsx";
import PersonalInfo from "./InforUserComponents/PersonalInfor.jsx";
import BorrowingHistory from "./InforUserComponents/BorrowingHistory.jsx";
import AdminNotifications from './InforUserComponents/AdminNotifications.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './InforUser.css';

const { Sider, Content } = Layout;

function InforUser() {
    const location = useLocation();
    const [activeComponent, setActiveComponent] = useState('info');

    // Khi navigate từ Header, set activeComponent dựa vào state truyền từ navigate
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveComponent(location.state.activeTab);
        }
    }, [location.state]);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'info':
                return <PersonalInfo />;
            case 'history':
                return <BorrowingHistory />;
            case 'notifications':
                return <AdminNotifications />;
            default:
                return <PersonalInfo />;
        }
    };

    return (
        <Layout className="user-profile-layout">
            <header>
                <Header setActiveComponent={setActiveComponent} />
            </header>

            <Layout className="user-profile__container">
                <Sider width={250} theme="light" className="user-profile__sidebar">
                    <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
                </Sider>

                <Content className="user-profile__content">
                    <div className="user-profile__active-view">{renderComponent()}</div>
                </Content>
            </Layout>

            <footer>
                <Footer />
            </footer>
        </Layout>
    );
}

export default InforUser;
