import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from "./InforUserComponents/Sidebar.jsx";
import PersonalInfo from "./InforUserComponents/PersonalInfor.jsx";
import BorrowingHistory from "./InforUserComponents/BorrowingHistory.jsx";

import Header from '../components/Header';
import Footer from '../components/Footer';
// Import file CSS riêng
import './InforUser.css';

const { Sider, Content } = Layout;

function InforUser() {
    const [activeComponent, setActiveComponent] = useState('info'); 

    const renderComponent = () => {
        switch (activeComponent) {
            case 'info':
                return <PersonalInfo />;
            case 'history':
                return <BorrowingHistory />;
            default:
                return <PersonalInfo />;
        }
    };

    return (
        // BEM: user-profile-layout
        <Layout className="user-profile-layout">
            <header>
                <Header />
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